import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import { useLoginMutation } from '@/features/auth';
import { applyApiErrorToForm } from '@/shared/lib/form-errors';
import { Button } from '@/shared/ui/button';

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useLoginMutation();

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onError: (error) => {
        applyApiErrorToForm(error, setError);
      },
    });
  };

  const isLoading = loginMutation.isPending;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Заголовок */}
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Вхід в акаунт</h1>
          <p className="text-sm text-muted-foreground">
            Введіть свій email та пароль для авторизації
          </p>
        </div>

        {/* Блок загальної помилки */}
        {loginMutation.isError && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {loginMutation.error.message || 'Неправильна пошта або пароль'}
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Поле Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('email', {
                required: "Email є обов'язковим",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Некоректний формат email',
                },
              })}
            />
            {errors.email && (
              <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Поле Пароль */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('password', {
                required: "Пароль є обов'язковим",
              })}
            />
            {errors.password && (
              <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Кнопка відправки */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Авторизація...' : 'Увійти'}
          </Button>
        </form>

        {/* Посилання на реєстрацію */}
        <div className="text-center text-sm text-muted-foreground">
          Ще не маєте акаунту?{' '}
          <Link
            to="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Зареєструватися
          </Link>
        </div>
      </div>
    </main>
  );
}
