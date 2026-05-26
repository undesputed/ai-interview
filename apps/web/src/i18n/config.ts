/**
 * Locale config — cookie-based switching, no URL prefix.
 * The product surfaces three languages: English (en-PH), Japanese (ja-JP),
 * and Chinese — Simplified (zh-CN).
 */

export const LOCALES = ['en-PH', 'ja-JP', 'zh-CN'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en-PH';

/** Cookie name used to persist the user's preferred locale. */
export const LOCALE_COOKIE = 'mv_locale';

/** Short labels for the LocaleSwitcher chip. */
export const LOCALE_LABELS: Record<Locale, string> = {
  'en-PH': 'EN',
  'ja-JP': '日本語',
  'zh-CN': '中文',
};

/** Full display names — used in dropdowns / tooltips. */
export const LOCALE_NAMES: Record<Locale, string> = {
  'en-PH': 'English',
  'ja-JP': '日本語',
  'zh-CN': '简体中文',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
