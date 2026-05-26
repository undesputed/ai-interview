import type { InterviewStatus, PublicInterview } from '@ai-interview/shared';

/** UI segments — narrower than the full status set; "today" is time-derived. */
export type InterviewSegment =
  | 'all'
  | 'today'
  | 'upcoming'
  | 'live'
  | 'completed'
  | 'draft';

const TZ = 'Asia/Manila';
const dayFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function manilaDay(iso: string): string {
  return dayFmt.format(new Date(iso));
}

function todayManilaDay(): string {
  return dayFmt.format(new Date());
}

export function countBySegment(
  rows: PublicInterview[],
): Record<InterviewSegment, number> {
  const today = todayManilaDay();
  const isUpcomingLike = (s: InterviewStatus) =>
    s === 'queued' || s === 'upcoming' || s === 'scheduled';

  return {
    all: rows.length,
    today: rows.filter(
      (r) => manilaDay(r.scheduledAt) === today && r.status !== 'completed' && r.status !== 'cancelled',
    ).length,
    upcoming: rows.filter((r) => isUpcomingLike(r.status)).length,
    live: rows.filter((r) => r.status === 'live').length,
    completed: rows.filter((r) => r.status === 'completed').length,
    draft: rows.filter((r) => r.status === 'draft').length,
  };
}

export function filterBySegment(
  rows: PublicInterview[],
  segment: InterviewSegment,
): PublicInterview[] {
  const today = todayManilaDay();
  switch (segment) {
    case 'all':
      return [...rows].sort(
        (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
      );
    case 'today':
      return rows
        .filter(
          (r) =>
            manilaDay(r.scheduledAt) === today &&
            r.status !== 'completed' &&
            r.status !== 'cancelled',
        )
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    case 'upcoming':
      return rows
        .filter(
          (r) => r.status === 'queued' || r.status === 'upcoming' || r.status === 'scheduled',
        )
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    case 'live':
      return rows.filter((r) => r.status === 'live');
    case 'completed':
      return rows
        .filter((r) => r.status === 'completed')
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
    case 'draft':
      return rows.filter((r) => r.status === 'draft');
  }
}
