export type Locale = 'en' | 'ar' | 'fr';

export function normaliseLocale(locale: string): Locale {
  if (locale === 'ar' || locale === 'fr') return locale;
  return 'en';
}
