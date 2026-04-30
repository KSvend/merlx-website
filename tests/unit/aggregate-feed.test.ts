import { describe, expect, it } from 'vitest';
import {
  buildAggregateInsightsQuery,
  buildAggregatePublicationsQuery,
} from '../../src/lib/aggregate-feed';

describe('buildAggregateInsightsQuery', () => {
  it('on group tenant returns syndicated + group-owned posts', () => {
    const q = buildAggregateInsightsQuery({ tenantKind: 'group', tenantId: 1 });
    expect(q).toEqual({
      and: [
        { status: { equals: 'published' } },
        {
          or: [{ tenant: { equals: 1 } }, { syndicate: { equals: true } }],
        },
      ],
    });
  });

  it('on studio/network/node tenant returns only own posts', () => {
    const q = buildAggregateInsightsQuery({ tenantKind: 'studio', tenantId: 2 });
    expect(q).toEqual({
      and: [{ status: { equals: 'published' } }, { tenant: { equals: 2 } }],
    });
  });
});

describe('buildAggregatePublicationsQuery', () => {
  it('mirrors the insights query shape', () => {
    const q = buildAggregatePublicationsQuery({ tenantKind: 'group', tenantId: 1 });
    expect(q).toEqual({
      and: [
        { status: { equals: 'published' } },
        {
          or: [{ tenant: { equals: 1 } }, { syndicate: { equals: true } }],
        },
      ],
    });
  });
});
