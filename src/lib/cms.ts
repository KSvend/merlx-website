/**
 * Thin Payload helpers for the marketing front-end.
 *
 * Each helper resolves the current tenant from request headers, runs
 * a scoped query, and returns the doc (or null). Pages, Insights, and
 * Publications all use the same find-by-slug-on-tenant pattern, so
 * pulling it here keeps each route file readable.
 */

import config from '@/payload.config';
import { getPayload } from 'payload';
import type { InsightsPost, OpticsTool, Page, Publication, Tenant } from '../../payload-types';
import { buildAggregateInsightsQuery, buildAggregatePublicationsQuery } from './aggregate-feed';
import type { TenantContext } from './tenant-aware';

interface FindArgs {
  tenant: Tenant;
  locale: string;
}

export async function findPageBySlug({
  tenant,
  slug,
  locale,
}: FindArgs & { slug: string }): Promise<Page | null> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: slug } },
        { tenant: { equals: tenant.id } },
        { status: { equals: 'published' } },
      ],
    },
    locale: locale as 'en' | 'ar' | 'fr',
    fallbackLocale: 'en',
    limit: 1,
  });
  return result.docs[0] ?? null;
}

interface InsightsListArgs {
  tenant: Tenant;
  tenantKind: TenantContext['kind'];
  locale: string;
  limit?: number;
}

export async function listInsights({
  tenant,
  tenantKind,
  locale,
  limit = 20,
}: InsightsListArgs): Promise<InsightsPost[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'insights-posts',
    where: buildAggregateInsightsQuery({ tenantKind, tenantId: tenant.id }),
    locale: locale as 'en' | 'ar' | 'fr',
    fallbackLocale: 'en',
    sort: '-publishedAt',
    limit,
  });
  return result.docs;
}

export async function findInsightBySlug({
  tenant,
  tenantKind,
  slug,
  locale,
}: InsightsListArgs & { slug: string }): Promise<InsightsPost | null> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'insights-posts',
    where: {
      and: [
        { slug: { equals: slug } },
        buildAggregateInsightsQuery({ tenantKind, tenantId: tenant.id }),
      ],
    },
    locale: locale as 'en' | 'ar' | 'fr',
    fallbackLocale: 'en',
    limit: 1,
  });
  return result.docs[0] ?? null;
}

interface PublicationsListArgs {
  tenant: Tenant;
  tenantKind: TenantContext['kind'];
  locale: string;
  limit?: number;
}

export async function listPublications({
  tenant,
  tenantKind,
  locale,
  limit = 50,
}: PublicationsListArgs): Promise<Publication[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'publications',
    where: buildAggregatePublicationsQuery({ tenantKind, tenantId: tenant.id }),
    locale: locale as 'en' | 'ar' | 'fr',
    fallbackLocale: 'en',
    sort: '-year',
    limit,
  });
  return result.docs;
}

export async function listOpticsTools({ tenant, locale }: FindArgs): Promise<OpticsTool[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'optics-tools',
    where: { tenant: { equals: tenant.id } },
    locale: locale as 'en' | 'ar' | 'fr',
    fallbackLocale: 'en',
    sort: 'order',
    limit: 50,
  });
  return result.docs;
}

export async function findOpticsToolBySlug({
  tenant,
  slug,
  locale,
}: FindArgs & { slug: string }): Promise<OpticsTool | null> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'optics-tools',
    where: {
      and: [{ slug: { equals: slug } }, { tenant: { equals: tenant.id } }],
    },
    locale: locale as 'en' | 'ar' | 'fr',
    fallbackLocale: 'en',
    limit: 1,
  });
  return result.docs[0] ?? null;
}

export async function findPublicationBySlug({
  tenant,
  tenantKind,
  slug,
  locale,
}: PublicationsListArgs & { slug: string }): Promise<Publication | null> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'publications',
    where: {
      and: [
        { slug: { equals: slug } },
        buildAggregatePublicationsQuery({ tenantKind, tenantId: tenant.id }),
      ],
    },
    locale: locale as 'en' | 'ar' | 'fr',
    fallbackLocale: 'en',
    limit: 1,
  });
  return result.docs[0] ?? null;
}
