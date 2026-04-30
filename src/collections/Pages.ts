import { publicRead } from '@/access/public-read';
import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: { read: publicRead },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL slug — e.g. "about", "legal/privacy"' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
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
    {
      name: 'seoDescription',
      type: 'textarea',
      localized: true,
      admin: { description: 'Used for OpenGraph + meta description.' },
    },
  ],
};
