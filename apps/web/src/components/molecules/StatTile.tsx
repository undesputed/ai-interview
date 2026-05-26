import { cn } from '@/lib/utils';

interface StatTileProps {
  label: string;
  value: string;
  unit?: string;
  caption: string;
  /** Direction signals trend color */
  delta?: { value: string; trend: 'up' | 'down' | 'flat' };
  /** Tiny decorative glyph at top right */
  glyph?: string;
  className?: string;
}

export function StatTile({
  label,
  value,
  unit,
  caption,
  delta,
  glyph,
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        'group/tile relative flex flex-col gap-5 border border-[var(--color-rule)] bg-[var(--color-paper)] p-5',
        'transition-colors hover:border-[var(--color-rule-strong)]',
        className,
      )}
    >
      {/* corner glyph */}
      {glyph && (
        <span
          aria-hidden
          className="absolute right-3 top-2.5 font-display text-[20px] italic leading-none text-[var(--color-amber)] opacity-50"
        >
          {glyph}
        </span>
      )}

      {/* label */}
      <span className="text-[10.5px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
        {label}
      </span>

      {/* value */}
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[44px] leading-none tracking-[-0.02em] text-[var(--color-ink)]">
          {value}
        </span>
        {unit && (
          <span className="text-[12px] tracking-tight text-[var(--color-muted)]">{unit}</span>
        )}
      </div>

      {/* caption + delta */}
      <div className="flex items-end justify-between gap-2">
        <span className="text-[12px] leading-snug text-[var(--color-ink-soft)]">{caption}</span>
        {delta && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[11px] tracking-tight',
              delta.trend === 'up' && 'text-[oklch(0.5_0.13_150)]',
              delta.trend === 'down' && 'text-[oklch(0.55_0.18_30)]',
              delta.trend === 'flat' && 'text-[var(--color-muted)]',
            )}
          >
            <span aria-hidden>
              {delta.trend === 'up' ? '↗' : delta.trend === 'down' ? '↘' : '→'}
            </span>
            {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}
