'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface RoomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** "on" = currently active (mic on, camera on). "off" = toggled off — gets a red diagonal indicator. */
  state?: 'on' | 'off' | 'neutral' | 'danger' | 'amber';
  label?: string;
  icon: React.ReactNode;
}

/**
 * Circular control-bar button with an editorial label below.
 * Uses scoped --color-* tokens so it adapts to .room-dark.
 */
export const RoomButton = forwardRef<HTMLButtonElement, RoomButtonProps>(
  function RoomButton({ state = 'neutral', label, icon, className, ...props }, ref) {
    const ring =
      state === 'off'
        ? 'border-[oklch(0.55_0.18_25/_0.7)] bg-[oklch(0.22_0.05_25)]'
        : state === 'danger'
          ? 'border-[oklch(0.55_0.18_25/_0.7)] bg-[oklch(0.32_0.10_25)] hover:bg-[oklch(0.40_0.13_25)]'
          : state === 'amber'
            ? 'border-[var(--color-amber)] bg-[color-mix(in_oklch,var(--color-paper)_70%,var(--color-amber-soft))]'
            : state === 'on'
              ? 'border-[var(--color-rule-strong)] bg-[var(--color-paper)] hover:border-[var(--color-ink-soft)]'
              : 'border-[var(--color-rule)] bg-transparent hover:border-[var(--color-rule-strong)] hover:bg-[var(--color-paper)]';

    return (
      <div className="flex flex-col items-center gap-1.5">
        <button
          ref={ref}
          {...props}
          className={cn(
            'group/btn relative grid h-11 w-11 place-items-center border text-[var(--color-ink)] transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-amber)]',
            ring,
            className,
          )}
        >
          {icon}
          {state === 'off' && (
            <span
              aria-hidden
              className="absolute left-0 top-1/2 h-px w-full origin-center rotate-45 bg-[oklch(0.65_0.20_25)]"
            />
          )}
        </button>
        {label && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {label}
          </span>
        )}
      </div>
    );
  },
);
