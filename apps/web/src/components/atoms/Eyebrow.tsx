import { cn } from '@/lib/utils';

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]',
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block h-px w-6 bg-[var(--color-rule-strong)]"
      />
      {children}
    </span>
  );
}
