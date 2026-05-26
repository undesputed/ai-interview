import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/atoms/Logo';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { LocaleSwitcher } from '@/components/organisms/LocaleSwitcher';

interface AuthShellProps {
  /** The form column on the right. */
  children: React.ReactNode;
  /** Page index, shown as "01 / 02" etc. */
  pageIndex: string;
  /** Tiny eyebrow string above the form column, e.g. "Member entry". */
  formEyebrow: string;
  /** Editorial headline rendered on the left. Use <em> for emphasis. */
  headline: React.ReactNode;
  /** Paragraph beneath the headline. */
  blurb: string;
  /** Small italic caption near the bottom of the left panel. */
  caption: string;
}

export function AuthShell({
  children,
  pageIndex,
  formEyebrow,
  headline,
  blurb,
  caption,
}: AuthShellProps) {
  const tNav = useTranslations('Nav');
  const tFooter = useTranslations('Footer');
  return (
    <div className="relative isolate min-h-screen w-full overflow-hidden">
      {/* Two-column layout */}
      <div className="grid min-h-screen w-full lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* ───────────────── LEFT — Editorial panel ───────────────── */}
        <section className="grain wash relative flex flex-col justify-between overflow-hidden px-8 py-10 sm:px-12 lg:px-16 lg:py-14">
          {/* decorative botanical line drawing */}
          <svg
            aria-hidden
            viewBox="0 0 600 800"
            className="pointer-events-none absolute -right-24 top-1/2 hidden h-[120%] -translate-y-1/2 text-[var(--color-amber)] opacity-[0.22] lg:block"
            fill="none"
          >
            <path
              d="M300 40 C 310 220, 370 320, 360 480 S 280 700, 300 780"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeDasharray="600"
              style={{ animation: 'draw 2400ms var(--ease-out-quart) both 200ms' }}
            />
            {Array.from({ length: 9 }).map((_, i) => {
              const y = 110 + i * 75;
              const w = 60 + Math.abs(Math.sin(i * 1.3)) * 70;
              const side = i % 2 === 0 ? 1 : -1;
              return (
                <path
                  key={i}
                  d={`M${300} ${y} q ${side * w * 0.6} ${-20} ${side * w} ${20 + (i % 3) * 8}`}
                  stroke="currentColor"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Top row — logo + meta */}
          <header className="relative z-10 flex items-start justify-between">
            <Logo />
            <span className="hidden text-[10.5px] uppercase tracking-[0.28em] text-[var(--color-muted)] sm:inline">
              est. 2026 · manila ⟷ tokyo
            </span>
          </header>

          {/* Center — headline + blurb */}
          <div className="relative z-10 max-w-[16ch] py-12 sm:py-16">
            <h1 className="font-display text-[clamp(2.6rem,6.2vw,5.4rem)] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] [&_em]:italic [&_em]:text-[var(--color-amber-deep)]">
              <span className="block rise" style={{ animationDelay: '60ms' }}>
                {/* headline rendered with line breaks honored by caller */}
                {headline}
              </span>
            </h1>
            <p
              className="rise mt-8 max-w-[36ch] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]"
              style={{ animationDelay: '320ms' }}
            >
              {blurb}
            </p>
          </div>

          {/* Bottom — page index + caption */}
          <footer className="relative z-10 flex items-end justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
                {pageIndex}
              </span>
              <span aria-hidden className="block h-px w-24 bg-[var(--color-rule-strong)]" />
            </div>
            <p className="hidden max-w-[28ch] text-right font-display text-[15px] italic leading-snug text-[var(--color-ink-soft)] sm:block">
              {caption}
            </p>
          </footer>
        </section>

        {/* ───────────────── RIGHT — Form column ───────────────── */}
        <section className="relative flex flex-col bg-[var(--color-paper)] px-8 py-10 sm:px-12 lg:px-14 lg:py-14">
          {/* Top eyebrow */}
          <div className="flex items-center justify-between gap-4">
            <Eyebrow>{formEyebrow}</Eyebrow>
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
              <Link
                href="/"
                className="text-[12px] tracking-tight text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:underline"
              >
                {tNav('backToSite')}
              </Link>
            </div>
          </div>

          {/* Form */}
          <div
            className="fade flex flex-1 flex-col justify-center py-12 lg:py-6"
            style={{ animationDelay: '160ms' }}
          >
            <div className="mx-auto w-full max-w-[26rem]">{children}</div>
          </div>

          {/* Footer ornament */}
          <div className="flex items-center justify-between text-[11px] text-[var(--color-muted)]">
            <span>© molave.ai</span>
            <span className="font-display italic">{tFooter('tag')}</span>
          </div>
        </section>
      </div>
    </div>
  );
}
