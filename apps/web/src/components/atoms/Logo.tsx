import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="text-[var(--color-amber)]"
      >
        <path
          d="M12 2.5c4 3.6 6.5 7.1 6.5 11.1 0 4.4-3 7.9-6.5 7.9s-6.5-3.5-6.5-7.9c0-4 2.5-7.5 6.5-11.1Z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="oklch(0.91 0.045 72 / 0.6)"
        />
        <path
          d="M12 6c0 5 0 9 0 15"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
      <span className="text-[15px] tracking-tight text-[var(--color-ink)]">
        molave<span className="text-[var(--color-amber)]">.</span>ai
      </span>
    </div>
  );
}
