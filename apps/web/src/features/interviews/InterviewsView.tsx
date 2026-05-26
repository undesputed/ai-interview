'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import type { InterviewStatus, PublicInterview } from '@ai-interview/shared';
import { interviewsKeys, listInterviews } from '@/lib/api/interviews';
import { countBySegment, filterBySegment, type InterviewSegment } from './segments';
import { InterviewSegments } from './InterviewSegments';
import { InterviewFilters } from './InterviewFilters';
import { InterviewRow } from './InterviewRow';
import { NewInterviewModal } from './NewInterviewModal';

/**
 * The interviews catalog. Pulls live data from `/interviews` via TanStack
 * Query and lets the user filter + segment client-side over that snapshot.
 */
export function InterviewsView() {
  const t = useTranslations('Interviews');
  const tStatus = useTranslations('Interviews.status');
  const [segment, setSegment] = useState<InterviewSegment>('all');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [aiMode, setAIMode] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: interviewsKeys.list(),
    queryFn: () => listInterviews(),
  });

  const counts = useMemo(
    () =>
      data
        ? countBySegment(data)
        : ({ all: 0, today: 0, upcoming: 0, live: 0, completed: 0, draft: 0 } as Record<
            InterviewSegment,
            number
          >),
    [data],
  );

  const roleOptions = useMemo(
    () => (data ? Array.from(new Set(data.map((r) => r.roleTitle))).sort() : []),
    [data],
  );

  const rows = useMemo(() => {
    if (!data) return [];
    let list = filterBySegment(data, segment);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.candidate.name.toLowerCase().includes(q) ||
          r.candidate.email.toLowerCase().includes(q) ||
          r.roleTitle.toLowerCase().includes(q) ||
          r.roleLocation.toLowerCase().includes(q),
      );
    }
    if (role !== 'all') list = list.filter((r) => r.roleTitle === role);
    if (aiMode !== 'all') list = list.filter((r) => r.aiMode === aiMode);
    return list;
  }, [data, segment, query, role, aiMode]);

  const groupedByStatus = useMemo(() => {
    if (segment !== 'all' || rows.length === 0) return null;
    const order: InterviewStatus[] = [
      'live',
      'queued',
      'upcoming',
      'scheduled',
      'completed',
      'draft',
      'cancelled',
    ];
    const map = new Map<InterviewStatus, PublicInterview[]>();
    for (const r of rows) {
      const list = map.get(r.status) ?? [];
      list.push(r);
      map.set(r.status, list);
    }
    return order
      .map((status) => ({ status, rows: map.get(status) ?? [] }))
      .filter((g) => g.rows.length > 0);
  }, [rows, segment]);

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
          <p className="mt-3 max-w-[52ch] text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
            {t('subhead')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="group/cta inline-flex items-center gap-2 bg-[var(--color-ink)] px-4 py-2.5 text-[12.5px] tracking-[0.04em] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-amber-deep)]"
        >
          <Plus strokeWidth={1.8} className="h-3.5 w-3.5" />
          {t('newInterview')}
        </button>
      </header>

      <InterviewSegments active={segment} counts={counts} onChange={setSegment} />

      <InterviewFilters
        query={query}
        onQueryChange={setQuery}
        role={role}
        onRoleChange={setRole}
        aiMode={aiMode}
        onAIModeChange={setAIMode}
        roleOptions={roleOptions}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState query={query} role={role} aiMode={aiMode} segment={segment} />
      ) : groupedByStatus ? (
        <div className="space-y-10">
          {groupedByStatus.map((group) => (
            <section key={group.status}>
              <header className="mb-2 flex items-baseline justify-between border-b border-[var(--color-rule-strong)] pb-2">
                <span className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
                  {tStatus(group.status)}
                </span>
                <span className="font-mono text-[10.5px] text-[var(--color-muted)]">
                  {group.rows.length}
                </span>
              </header>
              <div className="border border-[var(--color-rule)] bg-[var(--color-paper)]">
                {group.rows.map((r) => (
                  <InterviewRow key={r.id} row={r} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="border border-[var(--color-rule)] bg-[var(--color-paper)]">
          {rows.map((r) => (
            <InterviewRow key={r.id} row={r} />
          ))}
        </div>
      )}

      <NewInterviewModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[68px] animate-pulse border border-[var(--color-rule)] bg-[var(--color-paper)]"
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
          We couldn’t load your interviews.
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

function EmptyState({
  query,
  role,
  aiMode,
  segment,
}: {
  query: string;
  role: string;
  aiMode: string;
  segment: InterviewSegment;
}) {
  const t = useTranslations('Interviews.empty');
  const tSegment = useTranslations('Interviews.segment');
  const hasFilter = query || role !== 'all' || aiMode !== 'all';
  const title = hasFilter ? t('filteredTitle') : t('title');
  const body = hasFilter
    ? t('filteredBody', { segment: tSegment(segment) })
    : t('body');

  return (
    <div className="grid place-items-center border border-dashed border-[var(--color-rule-strong)] bg-[var(--color-paper)] px-6 py-20 text-center">
      <div className="max-w-[40ch] space-y-3">
        <p className="text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
          {tSegment(segment)}
        </p>
        <h2 className="font-display text-[28px] leading-tight tracking-tight text-[var(--color-ink)]">
          {title}
        </h2>
        <p className="text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{body}</p>
      </div>
    </div>
  );
}
