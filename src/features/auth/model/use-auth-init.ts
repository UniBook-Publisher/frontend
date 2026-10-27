import { useEffect } from 'react';

import { apiClient } from '@/shared/api/client';

import { clearSession, setSession } from './session';

export function useAuthInit() {
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data, error } = await apiClient.POST('/api/v1/auth/refresh');

        if (data && !error && isMounted) {
          setSession({
            userId: data.user_id,
            role: data.role,
            accessToken: data.access_token,
          });
        } else if (isMounted) clearSession();
      } catch {
        if (isMounted) clearSession();
      }
    }

    void initAuth();

    return () => {
      isMounted = false;
    };
  }, []);
}
