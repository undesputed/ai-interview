import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { AuthShell } from '@/components/templates/AuthShell';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { currentUser } from '@/lib/auth/server';

export default async function RegisterPage() {
  // Already signed in → straight to the dashboard, skip the form.
  if (await currentUser()) redirect('/dashboard');

  const t = await getTranslations('Auth');
  return (
    <AuthShell
      pageIndex={t('registerPageIndex')}
      formEyebrow={t('registerEyebrow')}
      headline={
        <>
          {t('registerHeadline1')}
          <br />
          <em>{t('registerHeadline2Italic')}</em>
          <br />
          {t('registerHeadline3')}
        </>
      }
      blurb={t('registerShellBlurb')}
      caption={t('registerShellCaption')}
    >
      <div className="mb-8 space-y-3">
        <h2 className="font-display text-[42px] leading-[1.05] tracking-[-0.01em] text-[var(--color-ink)]">
          {t('registerHeading1')}{' '}
          <em className="italic text-[var(--color-amber-deep)]">{t('registerHeading2Italic')}</em>
        </h2>
        <p className="text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
          {t('registerSubhead')}
        </p>
      </div>

      <RegisterForm />

      <p className="mt-8 text-[13.5px] text-[var(--color-ink-soft)]">
        {t('registerFooter')}{' '}
        <Link
          href="/login"
          className="font-display italic text-[var(--color-amber-deep)] underline-offset-4 transition-colors hover:underline"
        >
          {t('registerFooterLink')}
        </Link>
      </p>
    </AuthShell>
  );
}
