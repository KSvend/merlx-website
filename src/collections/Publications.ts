import { publicRead } from '@/access/public-read';
import type { CollectionConfig } from 'payload';

export const Publications: CollectionConfig = {
  slug: 'publications',
  access: { read: publicRead },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'type', 'syndicate', 'updatedAt'],
  },
  fields: [
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'authors',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'affiliation', type: 'text' },
      ],
    },
    { name: 'year', type: 'number', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'working-paper',
      options: [
        { label: 'Peer-reviewed paper', value: 'peer-reviewed' },
        { label: 'Working paper', value: 'working-paper' },
        { label: 'Brief', value: 'brief' },
        { label: 'Methodology note', value: 'methodology' },
        { label: 'Report', value: 'report' },
      ],
    },
    { name: 'abstract', type: 'textarea', localized: true },
    { name: 'doi', type: 'text' },
    {
      name: 'fileUrl',
      type: 'text',
      admin: { description: 'URL to PDF (Vercel Blob in production).' },
    },
    {
      name: 'language',
      type: 'select',
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'العربية', value: 'ar' },
        { label: 'Français', value: 'fr' },
      ],
    },
    { name: 'syndicate', type: 'checkbox', defaultValue: false },
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
