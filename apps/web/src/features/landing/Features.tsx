import { Mic, MessagesSquare, Compass, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

type FeatureKey = 'interviewer' | 'meetingAssistant' | 'roomAwareness';

interface FeatureBlock {
  key: FeatureKey;
  number: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const FEATURES: FeatureBlock[] = [
  { key: 'interviewer', number: '01', icon: Mic },
  { key: 'meetingAssistant', number: '02', icon: MessagesSquare },
  { key: 'roomAwareness', number: '03', icon: Compass },
];

export function Features() {
  const t = useTranslations('Features');
  return (
    <section id="features" className="relative px-6 py-28 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mb-20 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-3 text-[10.5px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
              <span aria-hidden className="block h-px w-8 bg-[var(--color-rule-strong)]" />
              {t('sectionEyebrow')}
            </span>
            <h2 className="mt-6 max-w-[18ch] font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.015em] text-[var(--color-ink)]">
              {t('sectionHeadline1')}
              <br />
              <em className="italic text-[var(--color-amber-deep)]">{t('sectionHeadline2')}</em>
              <br />
              {t('sectionHeadline3')}
            </h2>
          </div>
          <p className="max-w-[44ch] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
            {t('sectionBlurb')}
          </p>
        </div>

        <div className="space-y-px border border-[var(--color-rule)] bg-[var(--color-rule)]">
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.number} feature={f} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ feature, flip }: { feature: FeatureBlock; flip: boolean }) {
  const t = useTranslations(`Features.${feature.key}`);
  const tParent = useTranslations('Features');
  const Icon = feature.icon;
  return (
    <article
      className={`grid grid-cols-1 gap-10 bg-[var(--color-paper)] px-8 py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)_minmax(0,3fr)] lg:px-12 lg:py-16 ${
        flip ? 'lg:[&>*:nth-child(1)]:order-2 lg:[&>*:nth-child(2)]:order-1' : ''
      }`}
    >
      <header className="flex flex-col gap-5">
        <span className="text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
          {t('kicker')}
        </span>
        <span
          aria-hidden
          className="font-display text-[clamp(5rem,11vw,9.5rem)] leading-[0.85] tracking-[-0.04em] text-[var(--color-amber-deep)] opacity-90"
        >
          {feature.number}
        </span>
        <div className="mt-auto flex items-center gap-3 text-[var(--color-ink)]">
          <Icon strokeWidth={1.3} className="h-4 w-4 text-[var(--color-amber-deep)]" />
          <h3 className="text-[15px] tracking-tight">{t('name')}</h3>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <h4 className="font-display text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05] tracking-[-0.005em] text-[var(--color-ink)]">
          {t('headlineLine1')}
          <br />
          <em className="italic text-[var(--color-amber-deep)]">{t('headlineLine2')}</em>
        </h4>
        <p className="max-w-[50ch] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
          {t('blurb')}
        </p>
        <ul className="mt-2 grid gap-2.5 sm:grid-cols-2">
          {(['bullet1', 'bullet2', 'bullet3', 'bullet4'] as const).map((k) => (
            <li
              key={k}
              className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--color-ink)]"
            >
              <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 bg-[var(--color-amber)]" />
              {t(k)}
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="group/link mt-3 inline-flex w-fit items-center gap-2 border-b border-[var(--color-ink)] pb-1 text-[12.5px] tracking-[0.04em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-amber-deep)] hover:text-[var(--color-amber-deep)]"
        >
          {tParent('exploreCta')} {t('name').toUpperCase()}
          <ArrowUpRight
            strokeWidth={1.4}
            className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
          />
        </a>
      </div>

      <aside className="flex flex-col gap-4 border-l border-[var(--color-rule)] pl-6 text-[12.5px]">
        <span className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
          {tParent('specLabel')}
        </span>
        {([
          ['spec1Label', 'spec1Value'],
          ['spec2Label', 'spec2Value'],
          ['spec3Label', 'spec3Value'],
        ] as const).map(([labelKey, valueKey]) => (
          <div
            key={labelKey}
            className="flex flex-col gap-1 border-b border-[var(--color-rule)] pb-3 last:border-b-0"
          >
            <span className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
              {t(labelKey)}
            </span>
            <span className="font-display-text text-[14px] italic text-[var(--color-ink)]">
              {t(valueKey)}
            </span>
          </div>
        ))}
      </aside>
    </article>
  );
}
