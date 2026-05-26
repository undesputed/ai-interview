import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { AuthShell } from '@/components/templates/AuthShell';
import { LoginForm } from '@/features/auth/LoginForm';
import { currentUser } from '@/lib/auth/server';

export default async function LoginPage() {
  // Bounce already-authenticated visitors back to the dashboard.
  // currentUser() returns null with no cookie (zero-cost for new visitors);
  // for stale cookies it returns null too, so this never loops.
  if (await currentUser()) redirect('/dashboard');

  const t = await getTranslations('Auth');
  return (
    <AuthShell
      pageIndex={t('loginPageIndex')}
      formEyebrow={t('loginEyebrow')}
      headline={
        <>
          {t('loginHeadline1')}
          <br />
          {t('loginHeadline2')}
          <br />
          {t('loginHeadline3')} <em>{t('loginHeadline4Italic')}</em>
        </>
      }
      blurb={t('loginShellBlurb')}
      caption={t('loginShellCaption')}
    >
      <div className="mb-10 space-y-3">
        <h2 className="font-display text-[42px] leading-[1.05] tracking-[-0.01em] text-[var(--color-ink)]">
          {t('loginHeading1')}{' '}
          <em className="italic text-[var(--color-amber-deep)]">{t('loginHeading2Italic')}</em>
        </h2>
        <p className="text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
          {t('loginSubhead')}
        </p>
      </div>

      <LoginForm />

      <p className="mt-10 text-[13.5px] text-[var(--color-ink-soft)]">
        {t('loginFooter')}{' '}
        <Link
          href="/register"
          className="font-display italic text-[var(--color-amber-deep)] underline-offset-4 transition-colors hover:underline"
        >
          {t('loginFooterLink')}
        </Link>
      </p>
    </AuthShell>
  );
}
