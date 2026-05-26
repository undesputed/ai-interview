'use client';

import { useTranslations } from 'next-intl';
import type { InterviewSegment } from './segments';
import { cn } from '@/lib/utils';

interface InterviewSegmentsProps {
  active: InterviewSegment;
  counts: Record<InterviewSegment, number>;
  onChange: (segment: InterviewSegment) => void;
}

const SEGMENTS: InterviewSegment[] = ['all', 'today', 'upcoming', 'live', 'completed', 'draft'];

export function InterviewSegments({ active, counts, onChange }: InterviewSegmentsProps) {
  const t = useTranslations('Interviews.segment');

  return (
    <div
      role="tablist"
      aria-label="Interview segments"
      className="flex flex-wrap items-stretch gap-px border border-[var(--color-rule)] bg-[var(--color-rule)]"
    >
      {SEGMENTS.map((segment) => {
        const isActive = active === segment;
        const isLive = segment === 'live';
        return (
          <button
            key={segment}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(segment)}
            className={cn(
              'flex items-center gap-2 bg-[var(--color-paper)] px-4 py-2.5 transition-colors',
              isActive
                ? 'bg-[var(--color-canvas)] text-[var(--color-ink)]'
                : 'text-[var(--color-ink-soft)] hover:bg-[color-mix(in_oklch,var(--color-paper)_70%,var(--color-canvas))] hover:text-[var(--color-ink)]',
            )}
          >
            <span
              className={cn(
                'text-[11.5px] uppercase tracking-[0.22em]',
                isActive
                  ? isLive
                    ? 'text-[oklch(0.62_0.20_25)]'
                    : 'text-[var(--color-ink)]'
                  : '',
              )}
            >
              {t(segment)}
            </span>
            <span
              className={cn(
                'font-display text-[14px] italic leading-none',
                isActive ? 'text-[var(--color-amber-deep)]' : 'text-[var(--color-muted)]',
              )}
            >
              {counts[segment]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
