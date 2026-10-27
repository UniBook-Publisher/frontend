import { RouterProvider } from 'react-router/dom';

import { useAuthInit } from '@/features/auth';

import { AppProviders } from './providers/AppProviders';
import { router } from './router';

function AppContent() {
  useAuthInit();
  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
