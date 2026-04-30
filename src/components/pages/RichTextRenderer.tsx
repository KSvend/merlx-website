import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { Page } from '../../../payload-types';

interface RichTextRendererProps {
  data: Page['body'];
}

export function RichTextRenderer({ data }: RichTextRendererProps) {
  if (!data) return null;
  return <RichText data={data as unknown as SerializedEditorState} />;
}
