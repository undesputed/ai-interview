import { useTranslations } from 'next-intl';

export function Manifesto() {
  const t = useTranslations('Manifesto');
  return (
    <section className="relative bg-[var(--color-paper)] px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto grid w-full max-w-[1120px] gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-3 text-[10.5px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
            <span aria-hidden className="block h-px w-8 bg-[var(--color-rule-strong)]" />
            {t('eyebrow')}
          </span>

          <h2 className="mt-6 font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.015em] text-[var(--color-ink)]">
            {t('headline1')}
            <br />
            {t('headline2')}
            <br />
            <em className="italic text-[var(--color-amber-deep)]">{t('headline3')}</em>
          </h2>

          <p className="mt-8 max-w-[40ch] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
            {t('blurb')}
          </p>
        </div>

        <div className="flex flex-col">
          <ManifestoRow label={t('rowMeetingsLabel')} body={t('rowMeetingsBody')} />
          <ManifestoRow label={t('rowInterviewsLabel')} body={t('rowInterviewsBody')} />
          <ManifestoRow label={t('rowBothLabel')} body={t('rowBothBody')} />
        </div>
      </div>
    </section>
  );
}

function ManifestoRow({ label, body }: { label: string; body: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-6 border-t border-[var(--color-rule)] py-6 first:border-t-0 first:pt-0">
      <span className="font-display text-[15px] italic leading-snug text-[var(--color-amber-deep)]">
        {label}
      </span>
      <p className="text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{body}</p>
    </div>
  );
}
