import { toast } from 'sonner';

import { ApiError } from '@/shared/api/problem-detail';

export function notifyApiError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.problem.status === 401) return;
    toast.error(error.problem.title ?? 'Помилка', { description: error.problem.detail });
    return;
  }
  toast.error('Щось пішло не так', {
    description: error instanceof Error ? error.message : undefined,
  });
}
