import type { Access, Where } from 'payload';

export const isGroupAdmin: Access = ({ req }) => req.user?.role === 'group-admin';

export const tenantScopedRead: Access = ({ req }) => {
  if (!req.user) return false;
  if (req.user.role === 'group-admin') return true;

  const tenantIds = (req.user.tenants ?? [])
    .map((entry) => (typeof entry.tenant === 'object' ? entry.tenant?.id : entry.tenant))
    .filter(Boolean);

  if (tenantIds.length === 0) return false;
  const where: Where = { tenant: { in: tenantIds } };
  return where;
};
