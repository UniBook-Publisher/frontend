import { Link } from 'react-router';

import { Button } from '@/shared/ui/button';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-muted-foreground">Сторінку не знайдено</p>
      <Button asChild>
        <Link to="/">На головну</Link>
      </Button>
    </main>
  );
}
