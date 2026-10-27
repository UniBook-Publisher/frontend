import { Navigate, Outlet, useLocation } from 'react-router';

import { useSessionState } from '@/features/auth';

import { FullScreenSpinner } from './FullScreenSpinner';

export function ProtectedRoute() {
  const { session, isInitializing } = useSessionState();
  const location = useLocation();

  if (isInitializing) return <FullScreenSpinner />;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
