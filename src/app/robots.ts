import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerList = await headers();
  const kind = headerList.get('x-tenant-kind') ?? 'group';
  const subdomain = headerList.get('x-tenant-subdomain') ?? '';
  const host = (() => {
    if (kind === 'group') return 'merlx.org';
    if (kind === 'studio') return 'studio.merlx.org';
    if (kind === 'network') return 'network.merlx.org';
    if (kind === 'node' && subdomain) return `${subdomain}.merlx.org`;
    return 'merlx.org';
  })();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `https://${host}/sitemap.xml`,
    host,
  };
}
