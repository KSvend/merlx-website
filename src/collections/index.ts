import type { CollectionConfig } from 'payload';
import { InsightsPosts } from './InsightsPosts';
import { Leads } from './Leads';
import { Pages } from './Pages';
import { Publications } from './Publications';
import { Tenants } from './Tenants';
import { Users } from './Users';

export const collections: CollectionConfig[] = [
  Users,
  Tenants,
  Pages,
  InsightsPosts,
  Publications,
  Leads,
];
