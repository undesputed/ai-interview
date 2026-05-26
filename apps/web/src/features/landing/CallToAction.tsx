'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CallToAction() {
  const t = useTranslations('Cta');
  return (
    <section className="relative bg-[var(--color-ink)] px-6 py-28 text-[var(--color-canvas)] sm:px-10 sm:py-32">
      <svg
        aria-hidden
        viewBox="0 0 1000 500"
        className="pointer-events-none absolute inset-0 h-full w-full text-[var(--color-amber)] opacity-25"
        fill="none"
      >
        <path
          d="M-50 420 C 180 240, 520 280, 760 140 S 1080 -60, 1200 -120"
          stroke="currentColor"
          strokeWidth="0.9"
        />
        <path
          d="M-50 470 C 220 320, 540 340, 780 200"
          stroke="currentColor"
          strokeWidth="0.6"
        />
      </svg>

      <div className="relative mx-auto grid w-full max-w-[1080px] gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <span className="inline-flex items-center gap-3 text-[10.5px] uppercase tracking-[0.28em] text-[oklch(0.78_0.04_70)]">
            <span aria-hidden className="block h-px w-8 bg-[var(--color-amber)]" />
            {t('eyebrow')}
          </span>
          <h2 className="mt-6 max-w-[20ch] font-display text-[clamp(2.8rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.02em]">
            {t('headline1')}{' '}
            <em className="italic text-[var(--color-amber)]">{t('headline2Italic')}</em>{' '}
            {t('headline3')}
          </h2>
          <p className="mt-6 max-w-[44ch] text-[14.5px] leading-relaxed text-[oklch(0.82_0.024_70)]">
            {t('blurb')}
          </p>
        </div>

        <form
          className="flex flex-col gap-4 border border-[oklch(0.4_0.02_60)] bg-[color-mix(in_oklch,var(--color-ink)_70%,var(--color-amber-deep))] p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="flex flex-col gap-2">
            <span className="text-[10.5px] uppercase tracking-[0.24em] text-[oklch(0.78_0.04_70)]">
              {t('emailLabel')}
            </span>
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="border-0 border-b border-[oklch(0.5_0.02_60)] bg-transparent py-2 text-[15px] text-[var(--color-canvas)] outline-none transition-colors placeholder:text-[oklch(0.6_0.018_60)] focus:border-[var(--color-amber)]"
            />
          </label>

          <Link
            href="/register"
            className="group/cta mt-2 inline-flex items-center justify-between gap-2 bg-[var(--color-amber)] px-4 py-3 text-[13px] tracking-[0.05em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-canvas)]"
          >
            {t('submit')}
            <ArrowRight
              strokeWidth={1.6}
              className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1"
            />
          </Link>
          <p className="text-[11px] text-[oklch(0.72_0.02_70)]">
            {t('alreadyMember')}{' '}
            <Link
              href="/login"
              className="underline-offset-4 transition-colors hover:text-[var(--color-amber)] hover:underline"
            >
              {t('signInLink')}
            </Link>{' '}
            {t('alreadyMemberSuffix')}
          </p>
        </form>
      </div>
    </section>
  );
}
