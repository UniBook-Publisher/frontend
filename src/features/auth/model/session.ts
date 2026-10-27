import { useSyncExternalStore } from 'react';

import { setAccessToken } from '@/shared/api/auth-tokens';

import type { Role } from './roles';

export type Session = { userId: string; role: Role };

type SessionState = {
  session: Session | null;
  isInitializing: boolean;
};

let state: SessionState = {
  session: null,
  isInitializing: true,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export function setSession(next: Session & { accessToken: string }) {
  setAccessToken(next.accessToken);
  state = {
    session: { userId: next.userId, role: next.role },
    isInitializing: false,
  };
  emit();
}

export function clearSession() {
  setAccessToken(null);
  state = {
    session: null,
    isInitializing: false,
  };
  emit();
}

export function useSessionState(): SessionState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
  );
}

export function useSession(): Session | null {
  return useSessionState().session;
}
