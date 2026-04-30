import type { CollectionConfig } from 'payload';

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    read: () => true,
  },
  admin: { useAsTitle: 'displayName', defaultColumns: ['displayName', 'domain', 'type', 'status'] },
  fields: [
    {
      name: 'domain',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'e.g. merlx.org, studio.merlx.org, nilex.merlx.org' },
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Group', value: 'group' },
        { label: 'Studio', value: 'studio' },
        { label: 'Network', value: 'network' },
        { label: 'Node', value: 'node' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pre-launch',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Pre-launch', value: 'pre-launch' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'primaryLocale',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'العربية', value: 'ar' },
        { label: 'Français', value: 'fr' },
      ],
    },
    {
      name: 'supportedLocales',
      type: 'select',
      hasMany: true,
      defaultValue: ['en'],
      options: [
        { label: 'English', value: 'en' },
        { label: 'العربية', value: 'ar' },
        { label: 'Français', value: 'fr' },
      ],
    },
    {
      name: 'accentColor',
      type: 'select',
      required: true,
      defaultValue: 'teal',
      options: [
        { label: 'Teal', value: 'teal' },
        { label: 'Orange', value: 'orange' },
        { label: 'Sage', value: 'sage' },
        { label: 'Slate', value: 'slate' },
        { label: 'Deep Teal', value: 'deep-teal' },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'hasInsights',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Whether this tenant publishes Insights. Studio + Network always true; Nodes opt in.',
      },
    },
    {
      name: 'blobBucketPrefix',
      type: 'text',
      required: true,
      admin: { description: 'e.g. merlx-blob/studio. Used to scope media uploads.' },
    },
  ],
};
