import { getTranslations } from 'next-intl/server';
import { AppHeader } from '@/components/organisms/AppHeader';
import { QuestionsView } from '@/features/questions/QuestionsView';
import { buildTodayEyebrow } from '@/lib/header-eyebrow';

export default async function QuestionsPage() {
  const t = await getTranslations('AppSidebar');
  const eyebrow = await buildTodayEyebrow();

  return (
    <>
      <AppHeader eyebrow={eyebrow} title={t('questions')} />
      <main className="relative flex-1 px-10 py-10">
        <div className="mx-auto w-full max-w-[1320px]">
          <QuestionsView />
        </div>
      </main>
    </>
  );
}
