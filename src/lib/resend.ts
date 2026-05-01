import { Resend } from 'resend';

interface SendLeadEmailArgs {
  to: string;
  from?: string;
  subject: string;
  text: string;
}

export async function sendLeadEmail({
  to,
  from = 'MERLx <hello@merlx.org>',
  subject,
  text,
}: SendLeadEmailArgs): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY not set' };
  }

  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from,
    to,
    subject,
    text,
  });

  if (result.error) {
    return { ok: false, error: result.error.message };
  }
  return { ok: true };
}
