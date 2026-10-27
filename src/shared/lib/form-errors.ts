import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { ApiError, getFieldErrors } from '@/shared/api/problem-detail';

export function applyApiErrorToForm<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean {
  if (!(error instanceof ApiError)) return false;
  const entries = Object.entries(getFieldErrors(error.problem));
  for (const [field, messages] of entries) {
    setError(field as Path<T>, { type: 'server', message: messages.join(' ') });
  }
  return entries.length > 0;
}
