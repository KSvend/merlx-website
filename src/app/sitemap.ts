import { ENGAGEMENT_MODELS } from '@/content/engage';
import { NODES } from '@/content/nodes';
import { SERVICES } from '@/content/services';
import config from '@/payload.config';
import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getPayload } from 'payload';

const BASE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://merlx.org';

const LOCALES = ['en', 'ar', 'fr'] as const;

interface SitemapEntry {
  path: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const GROUP_ROUTES: SitemapEntry[] = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/insights', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/publications', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/legal/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/legal/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/legal/cookies', priority: 0.3, changeFrequency: 'yearly' },
];

const STUDIO_ROUTES: SitemapEntry[] = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/optics', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/engage', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/principles', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/insights', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/publications', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
];

const NETWORK_ROUTES: SitemapEntry[] = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/nodes', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/become-a-node', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/principles', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/insights', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/publications', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
];

const NILEX_ROUTES: SitemapEntry[] = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/deployments', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/news', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/insights', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/publications', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
];

function expand(host: string, routes: SitemapEntry[]): MetadataRoute.Sitemap {
  return routes.flatMap((r) =>
    LOCALES.map((locale) => ({
      url: `https://${host}/${locale}${r.path === '/' ? '' : r.path}`,
      lastModified: new Date(),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headerList = await headers();
  const kind = headerList.get('x-tenant-kind') ?? 'group';
  const subdomain = headerList.get('x-tenant-subdomain') ?? '';
  const host = (() => {
    if (kind === 'group') return new URL(BASE).host || 'merlx.org';
    if (kind === 'studio') return 'studio.merlx.org';
    if (kind === 'network') return 'network.merlx.org';
    if (kind === 'node' && subdomain) return `${subdomain}.merlx.org`;
    return 'merlx.org';
  })();

  if (kind === 'studio') {
    const payload = await getPayload({ config });
    const tools = await payload.find({ collection: 'optics-tools', limit: 50 });
    const toolEntries = tools.docs.flatMap((t) =>
      LOCALES.map((locale) => ({
        url: `https://${host}/${locale}/optics/${t.slug}`,
        lastModified: t.updatedAt ? new Date(t.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    );
    const engageEntries = ENGAGEMENT_MODELS.flatMap((m) =>
      LOCALES.map((locale) => ({
        url: `https://${host}/${locale}/engage/${m.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    );
    return [...expand(host, STUDIO_ROUTES), ...toolEntries, ...engageEntries];
  }

  if (kind === 'network') {
    const nodeEntries = NODES.flatMap((n) =>
      LOCALES.map((locale) => ({
        url: `https://${host}/${locale}/nodes/${n.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    );
    const serviceEntries = SERVICES.flatMap((s) =>
      LOCALES.map((locale) => ({
        url: `https://${host}/${locale}/services/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    );
    return [...expand(host, NETWORK_ROUTES), ...nodeEntries, ...serviceEntries];
  }

  if (kind === 'node') {
    return expand(host, NILEX_ROUTES);
  }

  return expand(host, GROUP_ROUTES);
}
