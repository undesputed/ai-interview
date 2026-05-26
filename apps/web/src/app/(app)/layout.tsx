import { redirect } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { AppShell } from '@/components/templates/AppShell';
import { currentUser } from '@/lib/auth/server';

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect('/login');

  const locale = await getLocale();
  const t = await getTranslations('AppSidebar');
  const tHeader = await getTranslations('AppHeader');

  const dateStr = new Date().toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AppShell
      user={user}
      headerEyebrow={`${tHeader('todayLabel')} · ${dateStr}`}
      headerTitle={t('dashboard')}
    >
      {children}
    </AppShell>
  );
}
