import { publicRead } from '@/access/public-read';
import type { CollectionConfig } from 'payload';

/**
 * Courses — the catalogue rendered on learn.merlx.org. Tenant-scoped
 * to the learn tenant. The website provides catalogue + landing
 * pages; the actual course player lives in the LMS we choose later.
 * `enrolmentUrl` is the deep-link target; until the LMS is wired,
 * routes fall back to /contact.
 */
export const Courses: CollectionConfig = {
  slug: 'courses',
  access: { read: publicRead },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'track', 'status', 'language', 'order', 'updatedAt'],
    description: 'Course catalogue for learn.merlx.org.',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL slug — e.g. "conflict-sensitive-evaluation".' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'One-liner shown in the catalogue card.' },
    },
    {
      name: 'track',
      type: 'select',
      required: true,
      defaultValue: 'cooperative-onboarding',
      options: [
        { label: 'Cooperative onboarding (Network)', value: 'cooperative-onboarding' },
        { label: 'Continuous learning (Network)', value: 'continuous-learning' },
        { label: 'Advanced MERL (donors / INGOs)', value: 'advanced-merl' },
        { label: 'Tool training (Optics Suite)', value: 'tool-training' },
      ],
    },
    {
      name: 'audience',
      type: 'select',
      required: true,
      hasMany: true,
      defaultValue: ['network'],
      options: [
        { label: 'Network researchers', value: 'network' },
        { label: 'Enumerators', value: 'enumerators' },
        { label: 'Donors', value: 'donors' },
        { label: 'INGO programme staff', value: 'ingo' },
        { label: 'Studio engineers', value: 'studio' },
      ],
    },
    {
      name: 'level',
      type: 'select',
      required: true,
      defaultValue: 'foundation',
      options: [
        { label: 'Foundation', value: 'foundation' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
    {
      name: 'language',
      type: 'select',
      required: true,
      hasMany: true,
      defaultValue: ['en'],
      options: [
        { label: 'English', value: 'en' },
        { label: 'العربية', value: 'ar' },
        { label: 'Français', value: 'fr' },
        { label: 'Español', value: 'es' },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "4 hours self-paced", "8 weeks cohort".' },
    },
    {
      name: 'format',
      type: 'select',
      required: true,
      defaultValue: 'self-paced',
      options: [
        { label: 'Self-paced', value: 'self-paced' },
        { label: 'Cohort', value: 'cohort' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
    {
      name: 'instructor',
      type: 'text',
      admin: { description: 'Lead instructor name (free-text for v1).' },
    },
    {
      name: 'instructorAffiliation',
      type: 'text',
    },
    {
      name: 'prerequisites',
      type: 'array',
      labels: { singular: 'Prerequisite', plural: 'Prerequisites' },
      fields: [{ name: 'item', type: 'text', required: true, localized: true }],
    },
    {
      name: 'learningOutcomes',
      type: 'array',
      labels: { singular: 'Learning outcome', plural: 'Learning outcomes' },
      fields: [{ name: 'outcome', type: 'text', required: true, localized: true }],
    },
    {
      name: 'outline',
      type: 'array',
      labels: { singular: 'Module', plural: 'Outline' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'summary', type: 'textarea', localized: true },
        {
          name: 'duration',
          type: 'text',
          admin: { description: 'e.g. "30 minutes", "Week 2".' },
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: { description: 'Long-form description on the course detail page.' },
    },
    {
      name: 'certifies',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Issues a completion certificate. Affects copy on the detail page.' },
    },
    {
      name: 'requiredForNodeAdmission',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Whether this course is part of the floor a new Network node must complete before formal admission.',
      },
    },
    {
      name: 'price',
      type: 'group',
      fields: [
        {
          name: 'model',
          type: 'select',
          defaultValue: 'free',
          options: [
            { label: 'Free', value: 'free' },
            { label: 'Free for Network nodes', value: 'free-network' },
            { label: 'Per seat', value: 'seat' },
            { label: 'Per cohort', value: 'cohort' },
            { label: 'Subscription', value: 'subscription' },
          ],
        },
        {
          name: 'amount',
          type: 'text',
          admin: { description: 'e.g. "€450", "First cohort free".' },
        },
        { name: 'note', type: 'text', localized: true },
      ],
    },
    {
      name: 'cohort',
      type: 'group',
      admin: {
        description: 'Set when format=cohort. Free-text for v1; promote to date fields if needed.',
      },
      fields: [
        { name: 'startsOn', type: 'text', admin: { description: 'e.g. "13 Oct 2026".' } },
        { name: 'endsOn', type: 'text' },
        { name: 'enrolmentDeadline', type: 'text' },
        { name: 'cohortSize', type: 'text', admin: { description: 'e.g. "20 participants".' } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open for enrolment', value: 'open' },
        { label: 'Cohort starting soon', value: 'starting-soon' },
        { label: 'Waitlist', value: 'waitlist' },
        { label: 'Closed', value: 'closed' },
        { label: 'Coming soon', value: 'coming-soon' },
      ],
    },
    {
      name: 'enrolmentUrl',
      type: 'text',
      admin: {
        description:
          'External LMS URL when wired. While unset, the website routes the CTA to /contact.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Sort order within the catalogue. Lower = earlier.' },
    },
  ],
};
