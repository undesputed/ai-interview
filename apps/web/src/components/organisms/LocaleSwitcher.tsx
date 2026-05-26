'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/config';
import { setLocaleAction } from '@/app/actions/set-locale';
import { cn } from '@/lib/utils';

/**
 * Inline locale chooser — three pill chips. Persists choice in a cookie
 * and refreshes the route so server-rendered strings re-fetch.
 *
 * `variant="compact"` is for headers / sidebars; `variant="inline"` is for
 * the landing nav where slightly more breathing room reads better.
 */
export function LocaleSwitcher({
  variant = 'compact',
  className,
}: {
  variant?: 'compact' | 'inline';
  className?: string;
}) {
  const current = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onPick = (next: Locale) => {
    if (next === current || pending) return;
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-[11px] tracking-tight text-[var(--color-muted)]',
        variant === 'inline' && 'gap-2 uppercase tracking-[0.18em]',
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <Globe strokeWidth={1.4} className="hidden h-3.5 w-3.5 sm:block" aria-hidden />
      {LOCALES.map((loc, i) => {
        const active = loc === current;
        return (
          <span key={loc} className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPick(loc)}
              disabled={pending}
              aria-pressed={active}
              className={cn(
                'transition-colors',
                active
                  ? 'text-[var(--color-ink)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]',
                pending && 'opacity-60',
              )}
            >
              {LOCALE_LABELS[loc]}
            </button>
            {i < LOCALES.length - 1 && (
              <span aria-hidden className="text-[var(--color-rule-strong)]">
                ·
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
