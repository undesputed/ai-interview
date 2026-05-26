'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import type {
  PublicQuestionSetSummary,
  QuestionSetAudience,
} from '@ai-interview/shared';
import { listQuestionSets, questionsKeys } from '@/lib/api/questions';
import { QuestionSetCard } from './QuestionSetCard';
import { cn } from '@/lib/utils';

type Segment = 'all' | QuestionSetAudience | 'draft';
const SEGMENTS: Segment[] = ['all', 'ai', 'human', 'both', 'draft'];

function countByAudience(rows: PublicQuestionSetSummary[]): Record<Segment, number> {
  return {
    all: rows.length,
    ai: rows.filter((r) => r.audience === 'ai' && r.status === 'published').length,
    human: rows.filter((r) => r.audience === 'human' && r.status === 'published').length,
    both: rows.filter((r) => r.audience === 'both' && r.status === 'published').length,
    draft: rows.filter((r) => r.status === 'draft').length,
  };
}

function filterByAudience(
  rows: PublicQuestionSetSummary[],
  segment: Segment,
): PublicQuestionSetSummary[] {
  switch (segment) {
    case 'all':
      return rows;
    case 'draft':
      return rows.filter((r) => r.status === 'draft');
    default:
      return rows.filter((r) => r.audience === segment && r.status === 'published');
  }
}

export function QuestionsView() {
  const t = useTranslations('Questions');
  const tSeg = useTranslations('Questions.segment');
  const [segment, setSegment] = useState<Segment>('all');
  const [query, setQuery] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: questionsKeys.list(),
    queryFn: () => listQuestionSets(),
  });

  const rows = useMemo(() => {
    if (!data) return [];
    let list = filterByAudience(data, segment);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.firstQuestion?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [data, segment, query]);

  const counts = useMemo(() => {
    if (!data) return { all: 0, ai: 0, human: 0, both: 0, draft: 0 } as Record<Segment, number>;
    return countByAudience(data);
  }, [data]);

  return (
    <div className="space-y-10">
      {/* Editorial header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
            <span aria-hidden className="block h-px w-6 bg-[var(--color-rule-strong)]" />
            {t('eyebrow')}
          </span>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,4.2vw,3.4rem)] leading-[1.02] tracking-[-0.015em] text-[var(--color-ink)]">
            {t('title')}
            <em className="italic text-[var(--color-amber-deep)]">.</em>
          </h1>
          <p className="mt-3 max-w-[56ch] text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
            {t('subhead')}
          </p>
        </div>

        <button
          type="button"
          className="group/cta inline-flex items-center gap-2 bg-[var(--color-ink)] px-4 py-2.5 text-[12.5px] tracking-[0.04em] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-amber-deep)]"
        >
          <Plus strokeWidth={1.8} className="h-3.5 w-3.5" />
          {t('newSet')}
        </button>
      </header>

      {/* Segments */}
      <div
        role="tablist"
        aria-label="Question audience"
        className="flex flex-wrap items-stretch gap-px border border-[var(--color-rule)] bg-[var(--color-rule)]"
      >
        {SEGMENTS.map((s) => {
          const active = segment === s;
          return (
            <button
              key={s}
              role="tab"
              aria-selected={active}
              onClick={() => setSegment(s)}
              className={cn(
                'flex items-center gap-2 bg-[var(--color-paper)] px-4 py-2.5 transition-colors',
                active
                  ? 'bg-[var(--color-canvas)] text-[var(--color-ink)]'
                  : 'text-[var(--color-ink-soft)] hover:bg-[color-mix(in_oklch,var(--color-paper)_70%,var(--color-canvas))] hover:text-[var(--color-ink)]',
              )}
            >
              <span className="text-[11.5px] uppercase tracking-[0.22em]">{tSeg(s)}</span>
              <span
                className={cn(
                  'font-display text-[14px] italic leading-none',
                  active ? 'text-[var(--color-amber-deep)]' : 'text-[var(--color-muted)]',
                )}
              >
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <label className="inline-flex w-full max-w-[420px] items-center gap-2 border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-[13px] text-[var(--color-muted)] transition-colors focus-within:border-[var(--color-rule-strong)]">
        <Search strokeWidth={1.4} className="h-3.5 w-3.5" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="flex-1 bg-transparent text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
        />
        <kbd className="border border-[var(--color-rule)] bg-[var(--color-canvas)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-muted)]">
          /
        </kbd>
      </label>

      {/* Grid / states */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {rows.map((set) => (
            <QuestionSetCard key={set.id} set={set} />
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[220px] animate-pulse border border-[var(--color-rule)] bg-[var(--color-paper)] p-6"
        />
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="grid place-items-center border border-dashed border-[oklch(0.55_0.18_30_/_0.4)] bg-[oklch(0.96_0.04_30/0.3)] px-6 py-14 text-center">
      <div className="max-w-[40ch] space-y-3">
        <h2 className="font-display text-[22px] leading-tight tracking-tight text-[var(--color-ink)]">
          We couldn’t load your question sets.
        </h2>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 border border-[var(--color-rule-strong)] bg-transparent px-3 py-2 text-[12.5px] tracking-tight text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper)]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  const t = useTranslations('Questions.empty');
  return (
    <div className="grid place-items-center border border-dashed border-[var(--color-rule-strong)] bg-[var(--color-paper)] px-6 py-20 text-center">
      <div className="max-w-[40ch] space-y-3">
        <h2 className="font-display text-[28px] leading-tight tracking-tight text-[var(--color-ink)]">
          {t('title')}
        </h2>
        <p className="text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{t('body')}</p>
      </div>
    </div>
  );
}
