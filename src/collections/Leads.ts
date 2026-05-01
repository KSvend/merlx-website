import type { Access, CollectionConfig } from 'payload';

const adminRead: Access = ({ req }) =>
  req.user?.role === 'group-admin' ||
  req.user?.role === 'studio-editor' ||
  req.user?.role === 'network-editor';

export const Leads: CollectionConfig = {
  slug: 'leads',
  access: {
    read: adminRead,
    create: () => true, // anyone can submit
    update: adminRead,
    delete: ({ req }) => req.user?.role === 'group-admin',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'organisation', 'tenantOrigin', 'submittedAt', 'status'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'organisation', type: 'text' },
    { name: 'role', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'interest',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Optics Suite (Studio)', value: 'studio' },
        { label: 'Network engagement', value: 'network' },
        { label: 'Hosted instance', value: 'hosted' },
        { label: 'Pilot & evaluate', value: 'pilot' },
        { label: 'Build-with', value: 'build-with' },
        { label: 'Advisory', value: 'advisory' },
      ],
    },
    {
      name: 'tenantOrigin',
      type: 'text',
      required: true,
      admin: {
        description: 'Which tenant + page the submission came from (e.g., "group:/contact").',
      },
    },
    {
      name: 'utm',
      type: 'group',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' },
      ],
    },
    {
      name: 'submittedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Spam', value: 'spam' },
      ],
    },
  ],
};
