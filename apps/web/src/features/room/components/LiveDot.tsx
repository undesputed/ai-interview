import { cn } from '@/lib/utils';

/** Pulsing dot used for "live", "recording", or active-source indicators. */
export function LiveDot({
  className,
  color = 'live',
  size = 'sm',
}: {
  className?: string;
  color?: 'live' | 'amber' | 'mute';
  size?: 'xs' | 'sm' | 'md';
}) {
  const palette = {
    live: 'var(--color-live, oklch(0.68 0.20 25))',
    amber: 'var(--color-amber)',
    mute: 'var(--color-muted)',
  } as const;
  const sizes = { xs: 'h-1 w-1', sm: 'h-1.5 w-1.5', md: 'h-2 w-2' } as const;
  return (
    <span
      aria-hidden
      className={cn('pulse-warm inline-block rounded-full', sizes[size], className)}
      style={{ backgroundColor: palette[color] }}
    />
  );
}
