'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { loginSchema, type LoginInput } from '@ai-interview/shared';
import { Field } from '@/components/atoms/Field';
import { PrimaryButton, GhostButton } from '@/components/atoms/PrimaryButton';
import { ApiError } from '@/lib/api/client';
import { login } from '@/lib/api/auth';

export function LoginForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/dashboard';

  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await login(values);
      router.push(from);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          for (const [field, message] of Object.entries(err.fieldErrors)) {
            setError(field as keyof LoginInput, { message });
          }
          return;
        }
        setFormError(err.message);
        return;
      }
      setFormError(t('genericError'));
    }
  });

  return (
    <form className="space-y-7" noValidate onSubmit={onSubmit}>
      <Field
        label={t('loginEmail')}
        type="email"
        autoComplete="email"
        placeholder={t('loginEmailPlaceholder')}
        aria-invalid={!!errors.email || undefined}
        {...register('email')}
        hint={errors.email && <FieldError>{errors.email.message}</FieldError>}
      />
      <Field
        label={t('loginPassword')}
        type="password"
        autoComplete="current-password"
        placeholder={t('loginPasswordPlaceholder')}
        aria-invalid={!!errors.password || undefined}
        {...register('password')}
        hint={
          errors.password ? (
            <FieldError>{errors.password.message}</FieldError>
          ) : (
            <Link
              href="#"
              className="text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-amber-deep)] hover:underline"
            >
              {t('loginForgot')}
            </Link>
          )
        }
      />

      {formError && <FormError>{formError}</FormError>}

      <div className="space-y-3 pt-3">
        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('loginSubmitting') : t('loginSubmit')}
        </PrimaryButton>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-[var(--color-rule)]" />
          <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
            {t('loginOr')}
          </span>
          <span className="h-px flex-1 bg-[var(--color-rule)]" />
        </div>

        <GhostButton type="button" disabled>
          <GoogleMark />
          {t('loginContinueGoogle')}
          <span className="ml-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {t('loginGoogleSoon')}
          </span>
        </GhostButton>
      </div>
    </form>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] text-[oklch(0.55_0.18_30)]">{children}</span>;
}

function FormError({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="border-l-2 border-[oklch(0.55_0.18_30)] bg-[oklch(0.96_0.04_30/0.6)] px-3 py-2 text-[12.5px] leading-snug text-[var(--color-ink)]"
    >
      {children}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
