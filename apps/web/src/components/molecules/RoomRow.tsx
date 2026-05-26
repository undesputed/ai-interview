import { Mic, MessagesSquare, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomRowProps {
  time: string;
  type: 'interview' | 'meeting';
  title: string;
  subtitle: string;
  /** Optional small chip text shown beside title */
  tag?: string;
  /** Status dot color hint */
  status?: 'upcoming' | 'live' | 'queued';
}

const STATUS_COPY: Record<NonNullable<RoomRowProps['status']>, { dot: string; label: string }> = {
  upcoming: { dot: 'oklch(0.7 0.02 60)', label: 'upcoming' },
  live: { dot: 'oklch(0.58 0.18 30)', label: 'live' },
  queued: { dot: 'var(--color-amber)', label: 'queued' },
};

export function RoomRow({
  time,
  type,
  title,
  subtitle,
  tag,
  status = 'upcoming',
}: RoomRowProps) {
  const Icon = type === 'interview' ? Mic : MessagesSquare;
  const statusInfo = STATUS_COPY[status];

  return (
    <a
      href="#"
      className={cn(
        'group/row grid grid-cols-[88px_22px_1fr_auto_22px] items-center gap-4',
        'border-b border-[var(--color-rule)] py-4 transition-colors last:border-b-0',
        'hover:bg-[var(--color-paper)]',
      )}
    >
      {/* Time */}
      <span className="font-display text-[20px] leading-none tracking-tight text-[var(--color-ink)]">
        {time}
      </span>

      {/* Icon */}
      <Icon
        strokeWidth={1.3}
        className={cn(
          'h-4 w-4',
          type === 'interview' ? 'text-[var(--color-amber-deep)]' : 'text-[var(--color-ink-soft)]',
        )}
      />

      {/* Title + subtitle */}
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] text-[var(--color-ink)]">{title}</span>
          {tag && (
            <span className="border border-[var(--color-rule)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {tag}
            </span>
          )}
        </div>
        <span className="truncate text-[12px] text-[var(--color-muted)]">{subtitle}</span>
      </div>

      {/* Status pill */}
      <div className="hidden items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] sm:flex">
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: statusInfo.dot }}
        />
        {statusInfo.label}
      </div>

      {/* Chevron */}
      <ChevronRight
        strokeWidth={1.3}
        className="h-4 w-4 text-[var(--color-muted)] transition-transform group-hover/row:translate-x-0.5 group-hover/row:text-[var(--color-ink)]"
      />
    </a>
  );
}
