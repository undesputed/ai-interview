import { cn } from '@/lib/utils';

interface EvaluationCardProps {
  candidate: string;
  role: string;
  score: string;
  recommendation: 'advance' | 'hold' | 'pass';
  /** Optional short pull-quote from the eval */
  pullQuote?: string;
  date: string;
}

const REC: Record<EvaluationCardProps['recommendation'], { label: string; tone: string }> = {
  advance: { label: 'Advance', tone: 'text-[oklch(0.5_0.13_150)]' },
  hold: { label: 'Hold', tone: 'text-[var(--color-amber-deep)]' },
  pass: { label: 'Pass', tone: 'text-[oklch(0.55_0.18_30)]' },
};

export function EvaluationCard({
  candidate,
  role,
  score,
  recommendation,
  pullQuote,
  date,
}: EvaluationCardProps) {
  const rec = REC[recommendation];
  return (
    <a
      href="#"
      className={cn(
        'group/card flex flex-col gap-3 border border-[var(--color-rule)] bg-[var(--color-paper)] p-5',
        'transition-colors hover:border-[var(--color-rule-strong)]',
      )}
    >
      {/* Top row */}
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[14px] text-[var(--color-ink)]">{candidate}</span>
          <span className="truncate text-[12px] text-[var(--color-muted)]">{role}</span>
        </div>
        <div className="flex shrink-0 items-baseline gap-1">
          <span className="font-display text-[26px] leading-none text-[var(--color-ink)]">
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            / 10
          </span>
        </div>
      </div>

      {/* Pull quote */}
      {pullQuote && (
        <p className="font-display text-[14px] italic leading-snug text-[var(--color-ink-soft)] before:mr-1 before:text-[var(--color-amber)] before:content-['“'] after:ml-0.5 after:text-[var(--color-amber)] after:content-['”']">
          {pullQuote}
        </p>
      )}

      {/* Footer */}
      <div className="mt-1 flex items-center justify-between border-t border-[var(--color-rule)] pt-3">
        <span className={cn('text-[11px] uppercase tracking-[0.22em]', rec.tone)}>
          {rec.label}
        </span>
        <span className="text-[11px] text-[var(--color-muted)]">{date}</span>
      </div>
    </a>
  );
}
