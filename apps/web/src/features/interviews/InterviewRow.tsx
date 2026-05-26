'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowUpRight, Bot, EyeOff, Headphones } from 'lucide-react';
import type {
  InterviewAIMode,
  InterviewRecommendation,
  InterviewStatus,
  PublicInterview,
} from '@ai-interview/shared';
import { cn } from '@/lib/utils';
import { relativeWhen } from '@/lib/dates';

const STATUS_TONE: Record<InterviewStatus, string> = {
  live: 'text-[oklch(0.62_0.20_25)] border-[oklch(0.62_0.20_25)]',
  queued: 'text-[var(--color-amber-deep)] border-[var(--color-amber)]',
  upcoming: 'text-[var(--color-ink-soft)] border-[var(--color-rule-strong)]',
  scheduled: 'text-[var(--color-ink-soft)] border-[var(--color-rule)]',
  completed: 'text-[oklch(0.45_0.13_150)] border-[oklch(0.45_0.13_150_/_0.4)]',
  draft: 'text-[var(--color-muted)] border-[var(--color-rule)] border-dashed',
  cancelled: 'text-[var(--color-muted)] border-[var(--color-rule)] line-through',
};

const AI_MODE_ICON: Record<InterviewAIMode, typeof Bot> = {
  active: Bot,
  copilot: Headphones,
  spectator: EyeOff,
};

const REC_TONE: Record<InterviewRecommendation, string> = {
  advance: 'text-[oklch(0.5_0.13_150)]',
  hold: 'text-[var(--color-amber-deep)]',
  pass: 'text-[oklch(0.55_0.18_30)]',
};

export function InterviewRow({ row }: { row: PublicInterview }) {
  const t = useTranslations('Interviews');
  const tAiMode = useTranslations('Interviews.aiMode');
  const tStatus = useTranslations('Interviews.status');
  const tRec = useTranslations('Interviews.recommendation');
  const { date, time } = relativeWhen(row.scheduledAt);
  const isCompleted = row.status === 'completed';
  const isLive = row.status === 'live';
  const isDraft = row.status === 'draft';
  const isCancelled = row.status === 'cancelled';
  const AIIcon = AI_MODE_ICON[row.aiMode];

  const href = isDraft ? `/interviews/${row.id}/setup` : `/rooms/${row.id}`;
  const ctaLabel = isLive
    ? t('joinCta')
    : isCompleted
      ? t('viewEvaluation')
      : isDraft
        ? t('continueCta')
        : t('openCta');

  return (
    <Link
      href={href}
      className={cn(
        'group/row grid items-center gap-4 border-b border-[var(--color-rule)] px-5 py-4 transition-colors last:border-b-0',
        'grid-cols-[110px_minmax(0,1.3fr)_minmax(0,1.4fr)_120px_70px_minmax(0,160px)_28px]',
        isLive && 'bg-[color-mix(in_oklch,var(--color-paper)_82%,oklch(0.95_0.06_25))]',
        (isDraft || isCancelled) && 'opacity-70 hover:opacity-100',
        !isLive && 'hover:bg-[var(--color-paper)]',
      )}
    >
      {/* When */}
      <div className="flex flex-col leading-tight">
        <span className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {date}
        </span>
        <span className="font-display text-[20px] tracking-tight text-[var(--color-ink)]">
          {time}
        </span>
      </div>

      {/* Candidate */}
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center border border-[var(--color-rule-strong)] bg-[var(--color-canvas)] font-display text-[14px] italic text-[var(--color-ink)]"
        >
          {row.candidate.initials}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[14px] text-[var(--color-ink)]">
            {row.candidate.name}
          </span>
          <span className="truncate text-[11px] text-[var(--color-muted)]">{row.language}</span>
        </div>
      </div>

      {/* Role */}
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[13.5px] text-[var(--color-ink)]">{row.roleTitle}</span>
        <span className="truncate text-[11px] text-[var(--color-muted)]">{row.roleLocation}</span>
      </div>

      {/* Duration / AI mode */}
      <div className="flex flex-col gap-1">
        <span className="text-[12px] text-[var(--color-ink-soft)]">
          {row.durationMin} {t('minutes')}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          <AIIcon strokeWidth={1.4} className="h-3 w-3" />
          {tAiMode(row.aiMode)}
        </span>
      </div>

      {/* Score (completed) or empty */}
      <div className="flex justify-end">
        {isCompleted && row.score !== null ? (
          <span className="font-display text-[22px] leading-none tracking-tight text-[var(--color-ink)] num-tabular">
            {row.score.toFixed(1)}
          </span>
        ) : null}
      </div>

      {/* Status / recommendation */}
      <div className="flex justify-end">
        {isCompleted && row.recommendation ? (
          <span
            className={cn(
              'text-[11px] uppercase tracking-[0.22em]',
              REC_TONE[row.recommendation],
            )}
          >
            {tRec(row.recommendation)}
          </span>
        ) : isLive ? (
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[oklch(0.62_0.20_25)]">
            <span aria-hidden className="pulse-warm h-1.5 w-1.5 rounded-full bg-[oklch(0.62_0.20_25)]" />
            {tStatus('live')}
            {row.remainingMin !== undefined && (
              <>
                {' · '}
                {row.remainingMin}m {t('left')}
              </>
            )}
          </span>
        ) : (
          <span
            className={cn(
              'inline-block border px-2 py-0.5 text-[10.5px] uppercase tracking-[0.22em]',
              STATUS_TONE[row.status],
            )}
          >
            {tStatus(row.status)}
          </span>
        )}
      </div>

      {/* Chevron / CTA */}
      <span className="flex items-center justify-end gap-1 text-[var(--color-muted)] transition-colors group-hover/row:text-[var(--color-ink)]">
        {isLive ? (
          <ArrowUpRight
            strokeWidth={1.4}
            className="h-4 w-4 text-[oklch(0.62_0.20_25)] transition-transform group-hover/row:translate-x-0.5"
          />
        ) : (
          <ArrowRight
            strokeWidth={1.3}
            className="h-4 w-4 transition-transform group-hover/row:translate-x-0.5"
          />
        )}
      </span>

      {/* Visually-hidden CTA for screenreaders */}
      <span className="sr-only">{ctaLabel}</span>
    </Link>
  );
}
