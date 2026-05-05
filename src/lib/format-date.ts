/**
 * Locale-aware date formatters. Uses Intl primitives so Arabic-Indic
 * numerals render automatically under /ar; ISO 8601 stays in mono
 * tabular contexts (per the design system Voice chunk).
 */

const isoLocale = (locale: string): string => {
  switch (locale) {
    case 'ar':
      return 'ar';
    case 'fr':
      return 'fr-FR';
    default:
      return 'en-GB';
  }
};

export function formatLongDate(input: string | Date | null | undefined, locale = 'en'): string {
  if (!input) return '';
  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(isoLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatIsoDate(input: string | Date | null | undefined): string {
  if (!input) return '';
  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}
