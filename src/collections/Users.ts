import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'studio-editor',
      options: [
        { label: 'Group Admin', value: 'group-admin' },
        { label: 'Studio Editor', value: 'studio-editor' },
        { label: 'Network Editor', value: 'network-editor' },
        { label: 'Node Admin', value: 'node-admin' },
        { label: 'Translator', value: 'translator' },
      ],
    },
  ],
};
