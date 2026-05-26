'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface RoomTimerProps {
  /** Initial elapsed seconds at mount. */
  initialElapsedSec: number;
  /** Session length in seconds. */
  durationSec: number;
  className?: string;
}

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Live elapsed / total timer with a hairline progress under it.
 * Goes amber in the last 5 minutes, red in the last 60 seconds.
 */
export function RoomTimer({ initialElapsedSec, durationSec, className }: RoomTimerProps) {
  const [elapsed, setElapsed] = useState(initialElapsedSec);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => Math.min(e + 1, durationSec)), 1000);
    return () => clearInterval(id);
  }, [durationSec]);

  const remaining = Math.max(0, durationSec - elapsed);
  const progress = Math.min(1, elapsed / durationSec);
  const tone =
    remaining <= 60
      ? 'text-[oklch(0.72_0.18_25)]'
      : remaining <= 5 * 60
        ? 'text-[var(--color-amber)]'
        : 'text-[var(--color-ink)]';

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline gap-2 font-mono num-tabular">
        <span className={cn('text-[15px] tracking-tight', tone)}>{fmt(elapsed)}</span>
        <span className="text-[11px] text-[var(--color-muted)]">/ {fmt(durationSec)}</span>
      </div>
      <div className="h-px w-32 bg-[var(--color-rule)]">
        <div
          className="h-full bg-[var(--color-amber)] transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
