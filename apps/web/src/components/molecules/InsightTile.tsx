import { cn } from '@/lib/utils';

interface InsightTileProps {
  signal: string;
  count: number;
  percent: number;
  caption: string;
}

export function InsightTile({ signal, count, percent, caption }: InsightTileProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-[var(--color-rule)] py-4 last:border-b-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] text-[var(--color-ink)]">{signal}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[18px] leading-none text-[var(--color-ink)]">
            {count}
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            nudges
          </span>
        </div>
      </div>
      {/* bar */}
      <div className="relative h-[3px] w-full bg-[var(--color-rule)]">
        <span
          aria-hidden
          className={cn('absolute inset-y-0 left-0 bg-[var(--color-amber)]')}
          style={{ width: `${Math.min(100, Math.max(4, percent))}%` }}
        />
      </div>
      <span className="text-[11.5px] leading-snug text-[var(--color-muted)]">{caption}</span>
    </div>
  );
}
