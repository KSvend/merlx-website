import type { Where } from 'payload';
import type { TenantContext } from './tenant-aware';

interface BuildArgs {
  tenantKind: TenantContext['kind'];
  tenantId: number;
}

/**
 * Build a Where clause that returns the right set of Insights posts
 * for a given tenant context.
 *
 * - Group tenant: own posts + any syndicated post from sub-tenants.
 * - Studio / Network / Node: only own posts.
 */
export function buildAggregateInsightsQuery({ tenantKind, tenantId }: BuildArgs): Where {
  if (tenantKind === 'group') {
    return {
      and: [
        { status: { equals: 'published' } },
        {
          or: [{ tenant: { equals: tenantId } }, { syndicate: { equals: true } }],
        },
      ],
    };
  }

  return {
    and: [{ status: { equals: 'published' } }, { tenant: { equals: tenantId } }],
  };
}

/**
 * Same query shape as Insights, applied to Publications.
 */
export function buildAggregatePublicationsQuery(args: BuildArgs): Where {
  return buildAggregateInsightsQuery(args);
}
