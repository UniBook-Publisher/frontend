import { isRouteErrorResponse, useRouteError } from 'react-router';

import { Button } from '@/shared/ui/button';

export function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Невідома помилка';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">Щось пішло не так</h1>
      <p className="text-muted-foreground">{message}</p>
      <Button onClick={() => window.location.assign('/')}>Перезавантажити</Button>
    </main>
  );
}
