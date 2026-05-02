import { publicRead } from '@/access/public-read';
import type { CollectionConfig } from 'payload';

/**
 * OpticsTools — Studio's six tools (PRISM, IRIS, Aperture, ToC Tester,
 * OASIS, ECHO). Tenant-scoped (studio tenant only). Authoring lives in
 * the Payload admin; the per-tool marketing pages at
 * studio.merlx.org/optics/[slug] read from this collection.
 */
export const OpticsTools: CollectionConfig = {
  slug: 'optics-tools',
  access: { read: publicRead },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'order', 'updatedAt'],
    description: 'Studio Optics Suite tool entries.',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL slug — e.g. "prism", "toc-tester"' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'One-liner for cards and hero.' },
    },
    {
      name: 'summary',
      type: 'richText',
      localized: true,
      admin: { description: 'Short paragraph used in cards / hero.' },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: { description: 'Full marketing copy on /optics/[slug].' },
    },
    {
      name: 'screenshots',
      type: 'array',
      labels: { singular: 'Screenshot', plural: 'Screenshots' },
      fields: [
        { name: 'caption', type: 'text', localized: true },
        {
          name: 'image',
          type: 'text',
          admin: { description: 'Image URL or media ID (uploads collection deferred to v1.5).' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'coming-soon',
      options: [
        { label: 'Live', value: 'live' },
        { label: 'Beta', value: 'beta' },
        { label: 'Coming soon', value: 'coming-soon' },
      ],
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        description: 'Where the live tool lives (if any). Renders the "Launch tool →" CTA.',
      },
    },
    {
      name: 'subdomain',
      type: 'text',
      admin: { description: 'e.g., "prism.merlx.org" — used by the proxy rule.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Sort order on /optics. Lower = earlier.' },
    },
  ],
};
