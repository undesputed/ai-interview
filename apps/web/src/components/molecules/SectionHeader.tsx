import Link from 'next/link';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  trailingHref?: string;
  trailingLabel?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  trailingHref,
  trailingLabel = 'view all →',
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
          <span aria-hidden className="block h-px w-5 bg-[var(--color-rule-strong)]" />
          {eyebrow}
        </span>
        <h2 className="font-display text-[22px] leading-tight tracking-[-0.005em] text-[var(--color-ink)]">
          {title}
        </h2>
      </div>
      {trailingHref && (
        <Link
          href={trailingHref}
          className="text-[12.5px] tracking-tight text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-amber-deep)] hover:underline"
        >
          {trailingLabel}
        </Link>
      )}
    </div>
  );
}
