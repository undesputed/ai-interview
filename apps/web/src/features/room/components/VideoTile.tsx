import { cn } from '@/lib/utils';
import { LiveDot } from './LiveDot';
import type { MockParticipant } from '../mockSession';

interface VideoTileProps {
  participant: MockParticipant;
  /** Tile size. "primary" = the candidate's large tile; "corner" = small picture-in-picture. */
  variant?: 'primary' | 'corner' | 'ai-corner';
  className?: string;
}

/**
 * Video placeholder — large initials over a warm gradient.
 * No WebRTC yet; this is a faithful stand-in for the live tile.
 * When `participant.state === 'speaking'`, the tile gets an amber edge glow.
 */
export function VideoTile({ participant, variant = 'primary', className }: VideoTileProps) {
  const isSpeaking = participant.state === 'speaking';
  const isAI = participant.role === 'ai';

  return (
    <div
      className={cn(
        'relative overflow-hidden border transition-colors',
        // Subtle warm gradient stand-in for a real video frame
        'bg-[radial-gradient(120%_90%_at_30%_20%,oklch(0.30_0.04_55_/_0.9),oklch(0.18_0.020_60))]',
        isSpeaking
          ? 'border-[var(--color-amber)] shadow-[0_0_0_1px_var(--color-amber-soft),0_0_24px_var(--color-amber-soft)]'
          : 'border-[var(--color-rule)]',
        variant === 'primary' && 'aspect-video w-full',
        variant === 'corner' && 'aspect-video w-[200px]',
        variant === 'ai-corner' && 'aspect-square w-[88px]',
        className,
      )}
    >
      {/* faint scanline texture — hints at video */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0 2px, oklch(0.95 0 0 / 0.6) 2px 3px)',
        }}
      />

      {/* Initials — large for primary tile, small for corners */}
      <div className="absolute inset-0 grid place-items-center">
        <span
          className={cn(
            'font-display tracking-[-0.02em] text-[var(--color-ink)] opacity-[0.92]',
            variant === 'primary' && 'text-[clamp(6rem,15vw,11rem)] leading-none',
            variant === 'corner' && 'text-[42px] leading-none',
            variant === 'ai-corner' && 'text-[28px] italic leading-none text-[var(--color-amber)]',
          )}
        >
          {participant.initials}
        </span>
      </div>

      {/* Top-left badge */}
      <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
        {isSpeaking && <LiveDot color="amber" size="sm" />}
        {participant.state === 'muted' && (
          <span className="grid h-4 w-4 place-items-center bg-[oklch(0.25_0.06_25)] text-[10px]">
            ⊘
          </span>
        )}
        <span
          className={cn(
            'text-[10px] uppercase tracking-[0.22em]',
            variant === 'primary' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]',
          )}
        >
          {participant.role === 'candidate'
            ? 'candidate'
            : participant.role === 'interviewer'
              ? 'you'
              : 'molave'}
        </span>
      </div>

      {/* Bottom-left name */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2">
        <span
          className={cn(
            'truncate font-display italic leading-none text-[var(--color-ink)]',
            variant === 'primary' ? 'text-[20px]' : 'text-[13px]',
          )}
        >
          {participant.name}
        </span>
        {variant === 'primary' && isAI && (
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-amber)]">
            ai voice
          </span>
        )}
      </div>
    </div>
  );
}
