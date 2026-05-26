import Link from 'next/link';
import { ArrowLeft, Signal } from 'lucide-react';
import { Logo } from '@/components/atoms/Logo';
import { AIModeChip } from './AIModeChip';
import { RoomTimer } from './RoomTimer';
import { LiveDot } from './LiveDot';
import type { MockSession } from '../mockSession';

const CONN_LABELS: Record<MockSession['connection'], { label: string; tone: string }> = {
  excellent: { label: 'excellent', tone: 'text-[oklch(0.78_0.12_150)]' },
  good: { label: 'good', tone: 'text-[var(--color-ink-soft)]' },
  fair: { label: 'fair', tone: 'text-[var(--color-amber)]' },
  poor: { label: 'poor', tone: 'text-[oklch(0.68_0.18_25)]' },
};

export function RoomHeader({ session }: { session: MockSession }) {
  const conn = CONN_LABELS[session.connection];

  return (
    <header className="flex h-[60px] shrink-0 items-center gap-6 border-b border-[var(--color-rule)] bg-[var(--color-canvas)] px-6">
      {/* Exit + brand */}
      <Link
        href="/dashboard"
        aria-label="Back to dashboard"
        className="inline-flex items-center gap-2 text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
      >
        <ArrowLeft strokeWidth={1.4} className="h-4 w-4" />
        <Logo />
      </Link>

      <span aria-hidden className="h-5 w-px bg-[var(--color-rule)]" />

      {/* Candidate + role */}
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-display text-[16px] italic text-[var(--color-ink)]">
          {session.candidate.name}
        </span>
        <span className="truncate text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {session.roleTitle}
        </span>
      </div>

      {/* Timer — center */}
      <div className="ml-auto flex items-center gap-6">
        <RoomTimer
          initialElapsedSec={session.elapsedSec}
          durationSec={session.durationSec}
        />

        <AIModeChip mode={session.aiMode} />

        <div className="hidden items-center gap-1.5 sm:flex">
          <LiveDot color="live" size="sm" />
          <span className="text-[10.5px] uppercase tracking-[0.22em] text-[oklch(0.72_0.18_25)]">
            Recording
          </span>
        </div>

        <div className="hidden items-center gap-1.5 lg:flex">
          <Signal strokeWidth={1.4} className={`h-3.5 w-3.5 ${conn.tone}`} />
          <span className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {conn.label}
          </span>
        </div>
      </div>
    </header>
  );
}
