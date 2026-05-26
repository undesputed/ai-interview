'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/api/auth';

export function LogoutButton() {
  const t = useTranslations('AppSidebar');
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      try {
        await logout();
      } catch {
        /* even if the call fails, kick the user to /login */
      }
      router.push('/login');
      router.refresh();
    });
  };

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="flex w-full items-center gap-3 px-3 py-2 text-left text-[13px] text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-canvas)] hover:text-[var(--color-ink)] disabled:opacity-60"
    >
      <LogOut strokeWidth={1.4} className="h-[15px] w-[15px] text-[var(--color-muted)]" />
      {pending ? t('signingOut') : t('signOut')}
    </button>
  );
}
