import createClient, { type Middleware } from 'openapi-fetch';

import { env } from '@/shared/config/env';

import { getAccessToken, setAccessToken } from './auth-tokens';
import { ApiError, parseProblem } from './problem-detail';
import type { components, paths } from './schema';

type AuthResponse = components['schemas']['AuthResponse'];

const PUBLIC_PATHS = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh'];
const isPublic = (request: Request) => PUBLIC_PATHS.includes(new URL(request.url).pathname);

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

let refreshPromise: Promise<AuthResponse | null> | null = null;

export function refreshSession(): Promise<AuthResponse | null> {
  refreshPromise ??= (async () => {
    try {
      const { data } = await apiClient.POST('/api/v1/auth/refresh');
      setAccessToken(data?.access_token ?? null);
      return data ?? null;
    } catch {
      setAccessToken(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

const retryCopies = new Map<string, Request>();

const authMiddleware: Middleware = {
  onRequest({ request, id }) {
    if (!isPublic(request)) {
      retryCopies.set(id, request.clone());
      const token = getAccessToken();
      if (token) request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },

  async onResponse({ request, response, id }) {
    const retryCopy = retryCopies.get(id);
    retryCopies.delete(id);
    let result = response;

    if (response.status === 401 && retryCopy && !isPublic(request)) {
      const session = await refreshSession();
      if (session) {
        retryCopy.headers.set('Authorization', `Bearer ${session.access_token}`);
        result = await fetch(retryCopy);
      } else {
        unauthorizedHandler?.();
      }
    }

    if (!result.ok) throw new ApiError(await parseProblem(result));
    return result;
  },

  onError({ id }) {
    retryCopies.delete(id);
  },
};

export const apiClient = createClient<paths>({
  baseUrl: env.VITE_API_BASE_URL,
  credentials: 'include',
});
apiClient.use(authMiddleware);
