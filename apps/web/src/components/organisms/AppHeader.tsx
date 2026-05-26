'use client';

import { Bell, Plus, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  /** Editorial path label, e.g. "Today · Monday, May 26" */
  eyebrow: string;
  /** Page name, becomes part of the breadcrumb */
  title?: string;
}

export function AppHeader({ eyebrow, title }: AppHeaderProps) {
  const t = useTranslations('AppHeader');
  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-[60px] items-center gap-6 px-10',
        'border-b border-[var(--color-rule)] bg-[color-mix(in_oklch,var(--color-canvas)_88%,transparent)] backdrop-blur',
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
          {eyebrow}
        </span>
        {title && (
          <>
            <span aria-hidden className="block h-px w-6 bg-[var(--color-rule-strong)]" />
            <span className="truncate font-display text-[15px] italic text-[var(--color-ink)]">
              {title}
            </span>
          </>
        )}
      </div>

      <div className="ml-auto hidden items-center gap-2 border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-1.5 text-[12.5px] text-[var(--color-muted)] transition-colors hover:border-[var(--color-rule-strong)] md:flex md:w-[280px]">
        <Search strokeWidth={1.4} className="h-3.5 w-3.5" />
        <span className="flex-1 truncate">{t('searchPlaceholder')}</span>
        <kbd className="border border-[var(--color-rule)] bg-[var(--color-canvas)] px-1.5 py-0.5 text-[10px] tracking-[0.1em] text-[var(--color-muted)]">
          ⌘K
        </kbd>
      </div>

      <LocaleSwitcher className="hidden sm:inline-flex" />

      <button
        aria-label="Notifications"
        className="relative grid h-9 w-9 place-items-center border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
      >
        <Bell strokeWidth={1.4} className="h-4 w-4" />
        <span
          aria-hidden
          className="absolute right-[7px] top-[7px] h-1.5 w-1.5 rounded-full bg-[var(--color-amber)]"
        />
      </button>

      <button className="group/cta inline-flex items-center gap-2 bg-[var(--color-ink)] px-3.5 py-2 text-[12.5px] tracking-[0.04em] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-amber-deep)]">
        <Plus strokeWidth={1.8} className="h-3.5 w-3.5" />
        {t('newRoom')}
        <span className="ml-1 text-[10px] uppercase tracking-[0.22em] opacity-70 transition-opacity group-hover/cta:opacity-100">
          ⌘N
        </span>
      </button>
    </header>
  );
}
