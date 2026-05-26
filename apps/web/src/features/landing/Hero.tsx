import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('Hero');
  return (
    <section
      id="room"
      className="grain wash relative isolate overflow-hidden px-6 pb-24 pt-36 sm:px-10 sm:pt-44 lg:pb-32"
    >
      <svg
        aria-hidden
        viewBox="0 0 800 900"
        className="pointer-events-none absolute -right-32 top-20 hidden h-[110%] text-[var(--color-amber)] opacity-[0.20] lg:block"
        fill="none"
      >
        <path
          d="M400 60 C 420 240, 480 360, 470 540 S 380 800, 400 880"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeDasharray="800"
          style={{ animation: 'draw 2800ms var(--ease-out-quart) both 300ms' }}
        />
        {Array.from({ length: 11 }).map((_, i) => {
          const y = 130 + i * 70;
          const w = 60 + Math.abs(Math.sin(i * 1.3)) * 80;
          const side = i % 2 === 0 ? 1 : -1;
          return (
            <path
              key={i}
              d={`M${400} ${y} q ${side * w * 0.6} ${-22} ${side * w} ${24 + (i % 3) * 8}`}
              stroke="currentColor"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <div className="relative mx-auto w-full max-w-[1320px]">
        <div
          className="rise inline-flex items-center gap-3 text-[10.5px] uppercase tracking-[0.28em] text-[var(--color-muted)]"
          style={{ animationDelay: '40ms' }}
        >
          <span aria-hidden className="block h-px w-8 bg-[var(--color-rule-strong)]" />
          {t('eyebrow')}
        </div>

        <h1 className="mt-7 max-w-[16ch] font-display text-[clamp(3rem,9vw,8.4rem)] leading-[0.94] tracking-[-0.02em] text-[var(--color-ink)]">
          <span className="rise block" style={{ animationDelay: '120ms' }}>
            {t('line1')}
          </span>
          <span className="rise block" style={{ animationDelay: '260ms' }}>
            {t('line2')}
          </span>
          <span
            className="rise block italic text-[var(--color-amber-deep)]"
            style={{ animationDelay: '400ms' }}
          >
            {t('line3')}
          </span>
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <p
            className="rise max-w-[44ch] text-[clamp(1rem,1.25vw,1.18rem)] leading-relaxed text-[var(--color-ink-soft)]"
            style={{ animationDelay: '560ms' }}
          >
            {t('blurb')}
          </p>

          <div
            className="rise relative border-l border-[var(--color-rule-strong)] pl-5"
            style={{ animationDelay: '700ms' }}
          >
            <p className="font-display text-[18px] italic leading-snug text-[var(--color-ink)]">
              {t('quote')}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
              {t('quoteAttr')}
            </p>
          </div>
        </div>

        <div
          className="rise mt-12 flex flex-wrap items-center gap-3"
          style={{ animationDelay: '820ms' }}
        >
          <Link
            href="/register"
            className="group/cta inline-flex items-center gap-3 bg-[var(--color-ink)] px-5 py-3.5 text-[13px] tracking-[0.05em] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-amber-deep)]"
          >
            {t('ctaRequestAccess')}
            <ArrowRight
              strokeWidth={1.6}
              className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1"
            />
          </Link>

          <button className="group/play inline-flex items-center gap-3 border border-[var(--color-rule-strong)] bg-transparent px-5 py-3.5 text-[13px] tracking-[0.05em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper)]">
            <Play strokeWidth={1.4} className="h-3.5 w-3.5 fill-current" />
            {t('ctaWatchRoom')}
            <span className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
              {t('ctaWatchDuration')}
            </span>
          </button>
        </div>

        <div
          className="rise mt-20 flex flex-wrap items-end justify-between gap-6 border-t border-[var(--color-rule)] pt-6"
          style={{ animationDelay: '980ms' }}
        >
          <div className="flex items-center gap-4">
            <span className="text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
              {t('venueIndex')}
            </span>
            <span aria-hidden className="block h-px w-20 bg-[var(--color-rule-strong)]" />
          </div>
          <p className="font-display text-[15px] italic leading-snug text-[var(--color-ink-soft)]">
            {t('venueTag')}
          </p>
        </div>
      </div>
    </section>
  );
}
