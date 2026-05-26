import { Check, MoveRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockQuestion } from '../mockSession';

export function QuestionList({ questions }: { questions: MockQuestion[] }) {
  const current = questions.findIndex((q) => q.status === 'current');
  const total = questions.length;
  return (
    <div className="flex flex-col gap-3">
      {/* header */}
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
          Questions
        </span>
        <span className="font-mono num-tabular text-[10.5px] text-[var(--color-ink-soft)]">
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* progress dots */}
      <div className="flex gap-1">
        {questions.map((q) => (
          <span
            key={q.number}
            aria-hidden
            className={cn(
              'h-px flex-1 transition-colors',
              q.status === 'asked'
                ? 'bg-[var(--color-amber)]'
                : q.status === 'current'
                  ? 'bg-[var(--color-amber)] shadow-[0_0_8px_var(--color-amber)]'
                  : 'bg-[var(--color-rule)]',
            )}
          />
        ))}
      </div>

      {/* list */}
      <ol className="mt-1 flex flex-col gap-2.5">
        {questions.map((q) => {
          const isCurrent = q.status === 'current';
          const isAsked = q.status === 'asked';
          return (
            <li
              key={q.number}
              className={cn(
                'group/q flex items-start gap-3 text-[12.5px] leading-snug',
                isCurrent && 'rounded-none bg-[color-mix(in_oklch,var(--color-paper)_60%,var(--color-amber-soft))] px-2 py-2',
              )}
            >
              <span
                className={cn(
                  'mt-px font-mono text-[10.5px]',
                  isCurrent
                    ? 'text-[var(--color-amber-deep)]'
                    : isAsked
                      ? 'text-[var(--color-muted)]'
                      : 'text-[var(--color-muted)]',
                )}
              >
                {String(q.number).padStart(2, '0')}
              </span>
              <p
                className={cn(
                  'flex-1',
                  isCurrent
                    ? 'font-display text-[13.5px] italic text-[var(--color-ink)]'
                    : isAsked
                      ? 'text-[var(--color-muted)] line-through decoration-[var(--color-rule-strong)] decoration-[0.5px]'
                      : 'text-[var(--color-ink-soft)]',
                )}
              >
                {q.text}
              </p>
              {isAsked &&
                (q.followups ? (
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    +{q.followups} fu
                  </span>
                ) : (
                  <Check
                    strokeWidth={1.4}
                    className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-muted)]"
                  />
                ))}
              {isCurrent && (
                <MoveRight
                  strokeWidth={1.4}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-amber-deep)]"
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
