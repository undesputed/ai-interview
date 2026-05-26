'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  CalendarDays,
  CircleUserRound,
  ClipboardList,
  Compass,
  FileText,
  LayoutGrid,
  MessagesSquare,
  Mic,
  Settings,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import type { PublicUser } from '@ai-interview/shared';
import { Logo } from '@/components/atoms/Logo';
import { LogoutButton } from '@/features/auth/LogoutButton';
import { cn } from '@/lib/utils';

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
}

interface NavSection {
  eyebrowKey: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    eyebrowKey: 'today',
    items: [{ labelKey: 'dashboard', href: '/dashboard', icon: LayoutGrid }],
  },
  {
    eyebrowKey: 'rooms',
    items: [
      { labelKey: 'interviews', href: '/interviews', icon: Mic, badge: '3' },
      { labelKey: 'meetings', href: '/meetings', icon: MessagesSquare, badge: '7' },
      { labelKey: 'schedule', href: '/schedule', icon: CalendarDays },
    ],
  },
  {
    eyebrowKey: 'library',
    items: [
      { labelKey: 'candidates', href: '/candidates', icon: UsersRound },
      { labelKey: 'evaluations', href: '/evaluations', icon: FileText },
      { labelKey: 'roles', href: '/roles', icon: ClipboardList },
    ],
  },
  {
    eyebrowKey: 'awareness',
    items: [
      { labelKey: 'insights', href: '/insights', icon: Compass },
      { labelKey: 'signals', href: '/signals', icon: Sparkles },
    ],
  },
];

export function AppSidebar({ user }: { user: PublicUser }) {
  const t = useTranslations('AppSidebar');
  const pathname = usePathname();
  const displayName = `${user.firstName} ${user.lastName}`.trim();
  const role = user.company ?? t('leadDesigner');

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen w-[256px] shrink-0 flex-col',
        'border-r border-[var(--color-rule)] bg-[var(--color-paper)]',
      )}
    >
      <div className="flex items-center justify-between px-6 pt-7 pb-6">
        <Logo />
        <button
          aria-label="Workspaces"
          className="grid h-7 w-7 place-items-center border border-[var(--color-rule)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
        >
          PF
        </button>
      </div>

      <div className="mx-6 mb-7 flex items-center gap-2 border border-[var(--color-rule)] bg-[var(--color-canvas)] px-3 py-2">
        <span aria-hidden className="h-1.5 w-1.5 bg-[var(--color-amber)]" />
        <span className="text-[12px] tracking-tight text-[var(--color-ink)]">
          {t('workspace')}
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {t('private')}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        {SECTIONS.map((section) => (
          <div key={section.eyebrowKey} className="mb-7">
            <div className="mb-2 flex items-center gap-2 px-3">
              <span aria-hidden className="block h-px w-3 bg-[var(--color-rule-strong)]" />
              <span className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
                {t(section.eyebrowKey)}
              </span>
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href} className="relative">
                    {active && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-[var(--color-amber)]"
                      />
                    )}
                    <Link
                      href={item.href}
                      className={cn(
                        'group/nav flex items-center gap-3 px-3 py-2 text-[13.5px] tracking-tight transition-colors',
                        active
                          ? 'text-[var(--color-ink)]'
                          : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-canvas)] hover:text-[var(--color-ink)]',
                      )}
                    >
                      <Icon
                        strokeWidth={1.4}
                        className={cn(
                          'h-[15px] w-[15px] transition-colors',
                          active
                            ? 'text-[var(--color-amber-deep)]'
                            : 'text-[var(--color-muted)] group-hover/nav:text-[var(--color-ink)]',
                        )}
                      />
                      <span className="flex-1">{t(item.labelKey)}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'font-display text-[13px] italic leading-none',
                            active ? 'text-[var(--color-amber-deep)]' : 'text-[var(--color-muted)]',
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--color-rule)] px-3 py-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 text-[13px] text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-canvas)] hover:text-[var(--color-ink)]"
        >
          <Settings strokeWidth={1.4} className="h-[15px] w-[15px] text-[var(--color-muted)]" />
          {t('settings')}
        </Link>
        <LogoutButton />
        <div className="mt-2 flex items-center gap-3 px-3 py-2">
          <div className="grid h-8 w-8 place-items-center border border-[var(--color-rule-strong)] bg-[var(--color-canvas)]">
            <CircleUserRound
              strokeWidth={1.2}
              className="h-5 w-5 text-[var(--color-ink-soft)]"
            />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[12.5px] text-[var(--color-ink)]">{displayName}</span>
            <span className="truncate text-[11px] text-[var(--color-muted)]">{role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
