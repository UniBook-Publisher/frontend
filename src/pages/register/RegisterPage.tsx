import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import { useRegisterMutation } from '@/features/auth';
import type { components } from '@/shared/api/schema';
import { applyApiErrorToForm } from '@/shared/lib/form-errors';
import { Button } from '@/shared/ui/button';

type RegisterFormValues = components['schemas']['RegisterRequest'] & {
  confirmPassword: string;
};

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      display_name: '',
      bio: '',
      preferred_locale: typeof navigator !== 'undefined' ? navigator.language : 'uk-UA',
    },
  });

  const registerMutation = useRegisterMutation();

  const onSubmit = (values: RegisterFormValues) => {
    const { confirmPassword: _confirmPassword, ...body } = values;

    registerMutation.mutate(
      { ...body, bio: body.bio?.trim() || undefined },
      {
        onError: (error) => {
          applyApiErrorToForm(error, setError);
        },
      },
    );
  };

  const isLoading = registerMutation.isPending;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Заголовок */}
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Реєстрація автора</h1>
          <p className="text-sm text-muted-foreground">
            Створіть свій акаунт для публікації рукописів
          </p>
        </div>

        {/* Загальна помилка сервера */}
        {registerMutation.isError && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {registerMutation.error.message || 'Не вдалося зареєструватися'}
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Поле Відображуване ім'я */}
          <div className="space-y-1.5">
            <label htmlFor="display_name" className="text-sm font-medium leading-none">
              Ім'я та прізвище (псевдонім)
            </label>
            <input
              id="display_name"
              type="text"
              placeholder="Тарас Шевченко"
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('display_name', {
                required: "Вкажіть ім'я або псевдонім",
                minLength: { value: 2, message: "Ім'я занадто коротке" },
              })}
            />
            {errors.display_name && (
              <p className="text-xs font-medium text-destructive">{errors.display_name.message}</p>
            )}
          </div>

          {/* Поле Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="author@example.com"
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
          <div className="space-y-1.5">
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
                minLength: { value: 8, message: 'Пароль має містити щонайменше 8 символів' },
              })}
            />
            {errors.password && (
              <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Підтвердження пароля */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
              Підтвердження пароля
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('confirmPassword', {
                required: 'Підтвердіть пароль',
                validate: (value, formValues) =>
                  value === formValues.password || 'Паролі не збігаються',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Коротке біо (необов'язково) */}
          <div className="space-y-1.5">
            <label htmlFor="bio" className="text-sm font-medium leading-none">
              Коротке біо <span className="text-muted-foreground">(опціонально)</span>
            </label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Розкажіть декілька слів про себе..."
              disabled={isLoading}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('bio')}
            />
          </div>

          {/* Кнопка відправки */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
          </Button>
        </form>

        {/* Посилання на логін */}
        <div className="text-center text-sm text-muted-foreground">
          Вже є акаунт?{' '}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Увійти
          </Link>
        </div>
      </div>
    </main>
  );
}
