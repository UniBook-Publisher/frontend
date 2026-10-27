import { Navigate, Outlet, useLocation } from 'react-router';

import { useSessionState } from '@/features/auth';

import { FullScreenSpinner } from './FullScreenSpinner';

export function GuestRoute() {
  const { session, isInitializing } = useSessionState();
  const location = useLocation();

  if (isInitializing) return <FullScreenSpinner />;

  if (session) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
    return <Navigate to={from ?? '/'} replace />;
  }

  return <Outlet />;
}
