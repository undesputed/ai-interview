import { ArrowUpRight, Bot, MessageCircleQuestion, UserRound, Users2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type {
  PublicQuestionSetSummary,
  QuestionSetAudience,
} from '@ai-interview/shared';
import { cn } from '@/lib/utils';
import { formatShortDate } from '@/lib/dates';

const AUDIENCE_ICON: Record<QuestionSetAudience, typeof Bot> = {
  ai: Bot,
  human: UserRound,
  both: Users2,
};

const AUDIENCE_TONE: Record<QuestionSetAudience, string> = {
  ai: 'text-[var(--color-amber-deep)] border-[var(--color-amber)]',
  human: 'text-[var(--color-ink-soft)] border-[var(--color-rule-strong)]',
  both: 'text-[oklch(0.5_0.13_150)] border-[oklch(0.5_0.13_150_/_0.4)]',
};

export function QuestionSetCard({ set }: { set: PublicQuestionSetSummary }) {
  const t = useTranslations('Questions');
  const tAud = useTranslations('Questions.audience');
  const isDraft = set.status === 'draft';
  const AudienceIcon = AUDIENCE_ICON[set.audience];

  return (
    <a
      href={`/questions/${set.id}`}
      className={cn(
        'group/card relative flex flex-col gap-4 border border-[var(--color-rule)] bg-[var(--color-paper)] p-6 transition-colors',
        'hover:border-[var(--color-rule-strong)] hover:bg-[color-mix(in_oklch,var(--color-paper)_90%,var(--color-amber-soft))]',
        isDraft && 'border-dashed opacity-80 hover:opacity-100',
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span
            className={cn(
              'inline-flex w-fit items-center gap-1.5 border px-2 py-0.5 text-[10.5px] uppercase tracking-[0.22em]',
              AUDIENCE_TONE[set.audience],
            )}
          >
            <AudienceIcon strokeWidth={1.4} className="h-3 w-3" />
            {tAud(set.audience)}
          </span>
          {isDraft && (
            <span className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
              · {t('status.draft')}
            </span>
          )}
        </div>

        <ArrowUpRight
          strokeWidth={1.3}
          className="h-4 w-4 text-[var(--color-muted)] transition-all group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-[var(--color-ink)]"
        />
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[22px] leading-tight tracking-[-0.005em] text-[var(--color-ink)]">
          {set.name}
        </h3>
        {set.description && (
          <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
            {set.description}
          </p>
        )}
      </div>

      {/* First question (italic, marginalia voice) */}
      {set.firstQuestion && (
        <div className="border-l-2 border-[var(--color-amber)] pl-3">
          <p className="font-display text-[14px] italic leading-snug text-[var(--color-ink)] before:mr-0.5 before:text-[var(--color-amber)] before:content-['“'] after:ml-0.5 after:text-[var(--color-amber)] after:content-['”']">
            {set.firstQuestion}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--color-rule)] pt-3 text-[11px] text-[var(--color-muted)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <MessageCircleQuestion strokeWidth={1.4} className="h-3 w-3" />
            <span className="num-tabular">{set.questionCount}</span>{' '}
            {t('questionsLabel', { count: set.questionCount })}
          </span>
          {set.usedInInterviews > 0 && (
            <span>· {t('usedIn', { count: set.usedInInterviews })}</span>
          )}
        </div>
        <span className="font-mono num-tabular text-[10.5px] uppercase tracking-tight">
          {t('updated')} · {formatShortDate(set.updatedAt)}
        </span>
      </div>
    </a>
  );
}
