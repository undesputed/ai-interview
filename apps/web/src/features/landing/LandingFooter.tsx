import { useTranslations } from 'next-intl';
import { Logo } from '@/components/atoms/Logo';

export function LandingFooter() {
  const t = useTranslations('Footer');

  const columns: { eyebrow: string; links: { label: string; href: string }[] }[] = [
    {
      eyebrow: t('columnProduct'),
      links: [
        { label: t('linkInterviewer'), href: '#features' },
        { label: t('linkMeetingAssistant'), href: '#features' },
        { label: t('linkRoomAwareness'), href: '#features' },
        { label: t('linkSafeguards'), href: '#safeguards' },
      ],
    },
    {
      eyebrow: t('columnFor'),
      links: [
        { label: t('linkRecruiters'), href: '#' },
        { label: t('linkHiringManagers'), href: '#' },
        { label: t('linkEngineeringLeads'), href: '#' },
        { label: t('linkCandidates'), href: '#' },
      ],
    },
    {
      eyebrow: t('columnMake'),
      links: [
        { label: t('linkArchitecture'), href: '#' },
        { label: t('linkPrivacy'), href: '#' },
        { label: t('linkBiasAudits'), href: '#' },
        { label: t('linkCost'), href: '#' },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-[var(--color-rule)] bg-[var(--color-paper)] px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-[36ch] font-display text-[18px] italic leading-snug text-[var(--color-ink-soft)]">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
                {t('venue')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.eyebrow} className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
                  {col.eyebrow}
                </span>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] text-[var(--color-ink-soft)] underline-offset-4 transition-colors hover:text-[var(--color-amber-deep)] hover:underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-rule)] pt-6 text-[11px] text-[var(--color-muted)]">
          <span className="font-mono tracking-tight">{t('copyright')}</span>
          <span className="font-display text-[13px] italic">{t('tag')}</span>
          <span className="font-mono tracking-tight">{t('credits')}</span>
        </div>
      </div>
    </footer>
  );
}
