import { Link } from 'react-router';

import { Button } from '@/shared/ui/button';

export function ForbiddenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">403</h1>
      <p className="text-muted-foreground">Недостатньо прав для перегляду цієї сторінки</p>
      <Button asChild>
        <Link to="/">На головну</Link>
      </Button>
    </main>
  );
}
