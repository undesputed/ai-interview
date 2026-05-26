import { useTranslations } from 'next-intl';

const RULES = ['01', '02', '03', '04', '05', '06', '07'] as const;

export function Safeguards() {
  const t = useTranslations('Safeguards');
  return (
    <section
      id="safeguards"
      className="grain wash relative isolate overflow-hidden px-6 py-28 sm:px-10 sm:py-32"
    >
      <div className="relative mx-auto w-full max-w-[1320px]">
        <div className="mb-16 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-3 text-[10.5px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
              <span aria-hidden className="block h-px w-8 bg-[var(--color-rule-strong)]" />
              {t('eyebrow')}
            </span>
            <h2 className="mt-6 max-w-[18ch] font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.015em] text-[var(--color-ink)]">
              {t('headline1')}{' '}
              <em className="italic text-[var(--color-amber-deep)]">{t('headline2Italic')}</em>{' '}
              {t('headline3')}
            </h2>
          </div>
          <p className="max-w-[44ch] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
            {t('blurb')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2 lg:grid-cols-3">
          {RULES.map((num, i) => (
            <article
              key={num}
              className={`group/sg relative flex flex-col gap-4 bg-[var(--color-paper)] p-7 transition-colors hover:bg-[color-mix(in_oklch,var(--color-paper)_70%,var(--color-amber-soft))] ${
                i === 6 ? 'lg:col-span-3' : ''
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className="font-display text-[clamp(2.4rem,4.4vw,3.6rem)] leading-none tracking-[-0.03em] text-[var(--color-amber-deep)] opacity-90"
                  aria-hidden
                >
                  {num}
                </span>
                <span className="text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
                  {t('ruleLabel')} {num}
                </span>
              </div>
              <h3 className="font-display text-[20px] leading-tight tracking-[-0.005em] text-[var(--color-ink)]">
                {t(`rule${num}Title`)}
              </h3>
              <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
                {t(`rule${num}Body`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
