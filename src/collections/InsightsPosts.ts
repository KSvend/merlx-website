import { publicRead } from '@/access/public-read';
import type { CollectionConfig } from 'payload';

export const InsightsPosts: CollectionConfig = {
  slug: 'insights-posts',
  access: { read: publicRead },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'syndicate', 'updatedAt'],
  },
  fields: [
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'body', type: 'richText', localized: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'analysis',
      options: [
        { label: 'News', value: 'news' },
        { label: 'Analysis', value: 'analysis' },
        { label: 'Field Note', value: 'field-note' },
        { label: 'Methods', value: 'methods' },
      ],
    },
    { name: 'publishedAt', type: 'date', required: true },
    {
      name: 'syndicate',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'When true, this post bubbles up to parent tenant aggregate feeds (Network → Group, Node → Network → Group).',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
};
