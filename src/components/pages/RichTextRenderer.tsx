/**
 * Placeholder RichTextRenderer — visual rebuild pending.
 * Just emits a JSON dump of the Lexical body for now so routes that
 * read CMS pages don't crash. Replace with a proper Lexical → React
 * renderer in the new design pass.
 */
// biome-ignore lint/suspicious/noExplicitAny: Lexical body shape is loose
export function RichTextRenderer({ data }: { data: any }) {
  if (!data) return null;
  return <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>;
}
