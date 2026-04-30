import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const headerList = await headers();
  return NextResponse.json({
    kind: headerList.get('x-tenant-kind'),
    subdomain: headerList.get('x-tenant-subdomain'),
    domain: headerList.get('x-tenant-domain'),
  });
}
