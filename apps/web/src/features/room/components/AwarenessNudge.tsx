'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockNudge } from '../mockSession';

/**
 * One private suggestion from Room Awareness — italic Fraunces body, amber
 * leading rule, signal line + timestamp eyebrow, dismissible.
 *
 * Designed to feel like marginalia, not a toast. New nudges fade in.
 */
export function AwarenessNudge({ nudge }: { nudge: MockNudge }) {
  const [dismissed, setDismissed] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  if (dismissed) return null;

  return (
    <article
      className={cn(
        'group/nudge relative border-l-2 border-[var(--color-amber)] bg-[var(--color-paper)] px-4 py-3.5',
        'transition-opacity duration-300',
      )}
    >
      {/* eyebrow row */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-amber)]">
          {nudge.signal}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10.5px] text-[var(--color-muted)]">{nudge.at}</span>
          <button
            type="button"
            aria-label="Dismiss nudge"
            onClick={() => setDismissed(true)}
            className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            <X strokeWidth={1.4} className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* the message — editorial italic */}
      <p className="font-display text-[15.5px] italic leading-snug text-[var(--color-ink)]">
        {nudge.message}
      </p>

      {/* optional rationale */}
      {nudge.rationale && (
        <div className="mt-2.5 flex flex-col">
          <button
            type="button"
            onClick={() => setShowWhy((v) => !v)}
            className="text-left text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink-soft)]"
          >
            {showWhy ? '— hide why' : '— why ↗'}
          </button>
          {showWhy && (
            <p className="mt-1.5 text-[11.5px] leading-snug text-[var(--color-ink-soft)]">
              {nudge.rationale}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
