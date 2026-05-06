/**
 * Course-catalogue helpers. Courses live under the learn tenant only;
 * read access is public via the publicRead helper on the collection.
 */

import config from '@/payload.config';
import { getPayload } from 'payload';
import type { Course, Tenant } from '../../payload-types';

interface ListArgs {
  tenant: Tenant;
  locale: string;
  limit?: number;
}

export async function listCourses({ tenant, locale, limit = 100 }: ListArgs): Promise<Course[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'courses',
    where: { tenant: { equals: tenant.id } },
    locale: locale as 'en' | 'ar' | 'fr',
    fallbackLocale: 'en',
    sort: 'order',
    limit,
  });
  return result.docs;
}

export async function findCourseBySlug({
  tenant,
  slug,
  locale,
}: ListArgs & { slug: string }): Promise<Course | null> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'courses',
    where: { and: [{ slug: { equals: slug } }, { tenant: { equals: tenant.id } }] },
    locale: locale as 'en' | 'ar' | 'fr',
    fallbackLocale: 'en',
    limit: 1,
  });
  return result.docs[0] ?? null;
}
