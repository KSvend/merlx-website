'use server';

import { sendLeadEmail } from '@/lib/resend';
import { verifyTurnstileToken } from '@/lib/turnstile';
import config from '@/payload.config';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import { z } from 'zod';
import type { Lead } from '../../payload-types';

const ContactPayload = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  organisation: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  message: z.string().min(10).max(5000),
  interest: z.array(z.string()).optional(),
  turnstileToken: z.string().optional(),
});

export type ContactSubmission = z.infer<typeof ContactPayload>;

export interface ContactResult {
  ok: boolean;
  error?: string;
}

export async function submitContact(input: unknown): Promise<ContactResult> {
  const parsed = ContactPayload.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'invalid_input' };
  }
  const data = parsed.data;

  // Verify Turnstile if configured
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!data.turnstileToken) {
      return { ok: false, error: 'turnstile_required' };
    }
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const valid = await verifyTurnstileToken(data.turnstileToken, ip);
    if (!valid) {
      return { ok: false, error: 'turnstile_invalid' };
    }
  }

  const headerList = await headers();
  const tenantKind = headerList.get('x-tenant-kind') ?? 'unknown';
  const tenantDomain = headerList.get('x-tenant-domain') ?? 'unknown';

  const payload = await getPayload({ config });

  await payload.create({
    collection: 'leads',
    data: {
      name: data.name,
      email: data.email,
      organisation: data.organisation,
      role: data.role,
      country: data.country,
      message: data.message,
      interest: data.interest as Lead['interest'],
      tenantOrigin: `${tenantKind}:${tenantDomain}/contact`,
      submittedAt: new Date().toISOString(),
      status: 'new',
    },
  });

  // Fire-and-forget email; don't fail the form if email fails (lead is saved)
  const inboxFrom = process.env.NEXT_PUBLIC_SITE_URL?.includes('merlx.org')
    ? 'hello@merlx.org'
    : 'no-reply@merlx.org';
  await sendLeadEmail({
    to: 'hello@merlx.org',
    from: `MERLx Lead Form <${inboxFrom}>`,
    subject: `[merlx.org] New lead from ${data.name}`,
    text: `From: ${data.name} <${data.email}>
Org: ${data.organisation ?? '-'}
Role: ${data.role ?? '-'}
Country: ${data.country ?? '-'}
Origin: ${tenantKind}:${tenantDomain}

${data.message}`,
  });

  return { ok: true };
}
