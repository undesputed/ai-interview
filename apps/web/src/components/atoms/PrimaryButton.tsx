import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const PrimaryButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function PrimaryButton({ className, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        'group/btn relative inline-flex w-full items-center justify-between',
        'rounded-none bg-[var(--color-ink)] px-5 py-3.5',
        'text-[13.5px] tracking-[0.05em] text-[var(--color-canvas)]',
        'transition-[transform,background-color] duration-300 ease-[var(--ease-out-quart)]',
        'hover:bg-[var(--color-amber-deep)] active:translate-y-px',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-amber)]',
        className,
      )}
    >
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="font-display italic text-[15px] leading-none">
          ⟶
        </span>
        {children}
      </span>
      <span
        aria-hidden
        className="text-[10px] uppercase tracking-[0.3em] opacity-70 transition-opacity group-hover/btn:opacity-100"
      >
        return ↵
      </span>
    </button>
  );
});

export const GhostButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function GhostButton({ className, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        'inline-flex w-full items-center justify-center gap-3',
        'border border-[var(--color-rule-strong)] bg-transparent px-5 py-3',
        'text-[13.5px] tracking-[0.04em] text-[var(--color-ink)]',
        'transition-colors duration-200',
        'hover:bg-[var(--color-paper)] hover:border-[var(--color-ink)]',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-amber)]',
        className,
      )}
    >
      {children}
    </button>
  );
});
