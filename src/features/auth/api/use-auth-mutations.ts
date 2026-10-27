import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { clearSession, setSession } from '@/features/auth';
import { apiClient } from '@/shared/api/client';
import type { components } from '@/shared/api/schema';

type LoginRequestBody = components['schemas']['LoginRequest'];
type RegisterRequestBody = components['schemas']['RegisterRequest'];

export function useLoginMutation() {
  return useMutation({
    meta: { silent: true },

    mutationFn: async (body: LoginRequestBody) => {
      const { data } = await apiClient.POST('/api/v1/auth/login', { body });
      if (!data) throw new Error('Помилка авторизації');
      return data;
    },
    onSuccess: (data) => {
      setSession({
        userId: data.user_id,
        role: data.role,
        accessToken: data.access_token,
      });
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    meta: { silent: true },

    mutationFn: async (body: RegisterRequestBody) => {
      const { data } = await apiClient.POST('/api/v1/auth/register', { body });
      if (!data) throw new Error('Помилка реєстрації');
      return data;
    },
    onSuccess: (data) => {
      setSession({
        userId: data.user_id,
        role: data.role,
        accessToken: data.access_token,
      });
    },
  });
}

export function useLogoutMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.POST('/api/v1/auth/logout');
    },
    onSettled: () => {
      clearSession();
      queryClient.clear();
      void navigate('/login', { replace: true });
    },
  });
}
