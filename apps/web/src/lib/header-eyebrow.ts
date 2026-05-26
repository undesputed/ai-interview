/**
 * Build the "Today · Monday, May 26" eyebrow used in app page headers.
 * Server-side because it depends on the request's locale.
 */
import { getLocale, getTranslations } from 'next-intl/server';

export async function buildTodayEyebrow(): Promise<string> {
  const locale = await getLocale();
  const t = await getTranslations('AppHeader');
  const dateStr = new Date().toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  return `${t('todayLabel')} · ${dateStr}`;
}
