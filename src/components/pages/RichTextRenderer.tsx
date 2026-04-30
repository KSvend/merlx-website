import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { RichText } from '@payloadcms/richtext-lexical/react';

interface RichTextRendererProps {
  data: SerializedEditorState | null | undefined;
}

export function RichTextRenderer({ data }: RichTextRendererProps) {
  if (!data) return null;
  return <RichText data={data} />;
}
