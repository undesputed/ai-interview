import { useTranslations } from 'next-intl';

interface BeatMeta {
  time: string;
  key: '1' | '2' | '3' | '4' | '5';
  highlight?: boolean;
}

const BEATS: BeatMeta[] = [
  { time: '00:00', key: '1' },
  { time: '03:42', key: '2' },
  { time: '03:43', key: '3', highlight: true },
  { time: '03:50', key: '4' },
  { time: '45:00', key: '5' },
];

export function Scenario() {
  const t = useTranslations('Scenario');
  return (
    <section
      id="scenario"
      className="relative bg-[var(--color-canvas)] px-6 py-28 sm:px-10 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1080px]">
        <div className="mb-14">
          <span className="inline-flex items-center gap-3 text-[10.5px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
            <span aria-hidden className="block h-px w-8 bg-[var(--color-rule-strong)]" />
            {t('eyebrow')}
          </span>
          <h2 className="mt-6 max-w-[20ch] font-display text-[clamp(2.4rem,4.4vw,3.8rem)] leading-[1.04] tracking-[-0.015em] text-[var(--color-ink)]">
            {t('headline1')}
            <br />
            <em className="italic text-[var(--color-amber-deep)]">{t('headline2')}</em>
          </h2>
          <p className="mt-6 max-w-[52ch] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
            {t('blurb')}
          </p>
        </div>

        <ol className="relative">
          <span
            aria-hidden
            className="absolute left-[78px] top-2 h-[calc(100%-1rem)] w-px bg-[var(--color-rule)] sm:left-[110px]"
          />
          {BEATS.map((beat) => (
            <li
              key={beat.key}
              className="relative grid grid-cols-[64px_22px_1fr] items-start gap-4 py-6 sm:grid-cols-[96px_22px_1fr]"
            >
              <span className="font-mono num-tabular text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {beat.time}
              </span>
              <span
                aria-hidden
                className={`relative top-1.5 h-2.5 w-2.5 ${
                  beat.highlight
                    ? 'bg-[var(--color-amber)]'
                    : 'border border-[var(--color-rule-strong)] bg-[var(--color-canvas)]'
                }`}
              />
              <div className="flex flex-col gap-2">
                <span
                  className={`text-[11px] uppercase tracking-[0.22em] ${
                    beat.highlight
                      ? 'text-[var(--color-amber-deep)]'
                      : 'text-[var(--color-muted)]'
                  }`}
                >
                  {t(`beat${beat.key}Actor`)}
                </span>
                <p className="font-display text-[clamp(1.1rem,1.6vw,1.4rem)] leading-snug text-[var(--color-ink)]">
                  {t(`beat${beat.key}Body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
