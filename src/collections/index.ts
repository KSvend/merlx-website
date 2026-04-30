import type { CollectionConfig } from 'payload';
import { Tenants } from './Tenants';
import { Users } from './Users';

export const collections: CollectionConfig[] = [Users, Tenants];
