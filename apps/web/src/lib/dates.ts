/**
 * Date helpers — timezone-deterministic so server (UTC docker) and client
 * (browser tz) produce identical strings.
 *
 * Everything is rendered in Asia/Manila by design: the brand is Manila-
 * anchored and consistency across both runtimes avoids hydration mismatches.
 */

const TZ = 'Asia/Manila';
const DAY_MS = 86_400_000;

const dayFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const weekdayFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  weekday: 'short',
});
const monthDayFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  month: 'short',
  day: 'numeric',
});

/** UTC-midnight ms of the calendar day this instant falls on in Manila. */
function isoToManilaDayMs(iso: string | Date): number {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  const [yyyy, mm, dd] = dayFmt.format(d).split('-').map(Number) as [
    number,
    number,
    number,
  ];
  return Date.UTC(yyyy, mm - 1, dd);
}

/** UTC-midnight ms of *today* in Manila. */
function todayManilaDayMs(): number {
  return isoToManilaDayMs(new Date());
}

/** "today · 14:00", "Wed · 09:00", "May 22", "yesterday · 11:30", etc. */
export function relativeWhen(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const time = timeFmt.format(d);
  const diffDays = Math.round(
    (isoToManilaDayMs(iso) - todayManilaDayMs()) / DAY_MS,
  );

  let date: string;
  if (diffDays === 0) date = 'today';
  else if (diffDays === 1) date = 'tomorrow';
  else if (diffDays === -1) date = 'yesterday';
  else if (diffDays > 1 && diffDays <= 6) date = weekdayFmt.format(d);
  else date = monthDayFmt.format(d);
  return { date, time };
}

/** "May 22" style absolute label. */
export function formatShortDate(iso: string): string {
  return monthDayFmt.format(new Date(iso));
}
