import { Navigate, Outlet } from 'react-router';

import { useSession } from '@/features/auth';

import type { Role } from '../model/roles';

export function RoleGuard({ allow }: { allow: Role[] }) {
  const session = useSession();
  if (!session || !allow.includes(session.role)) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
