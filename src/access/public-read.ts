import type { Access } from 'payload';

/**
 * Public-read access: anyone may read; only authenticated users may write.
 * Used on collections that serve content to unauthenticated visitors
 * (Tenants, Pages, Insights, Publications).
 *
 * Required because Payload v3.84's bare default for non-auth collections
 * denies anonymous reads.
 */
export const publicRead: Access = () => true;
