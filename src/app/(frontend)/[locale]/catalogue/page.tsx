import { PageShell } from '@/components/chrome/PageShell';
import {
  AUDIENCE_LABEL,
  FORMAT_LABEL,
  LANGUAGE_LABEL,
  LEARN_TRACKS,
  LEVEL_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
} from '@/content/learn-tracks';
import { listCourses } from '@/lib/learn-cms';
import { isLearnTenant, requireLearnTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ track?: string; language?: string; audience?: string }>;
}

export default async function CataloguePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { track, language, audience } = await searchParams;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isLearnTenant(headerList)) notFound();

  const payload = await getPayload({ config });
  const tenant = await requireLearnTenant(headerList, payload);
  const all = await listCourses({ tenant, locale });

  const filtered = all.filter((c) => {
    if (track && c.track !== track) return false;
    if (language && !(c.language ?? []).includes(language as 'en' | 'ar' | 'fr' | 'es'))
      return false;
    if (
      audience &&
      !(c.audience ?? []).includes(
        audience as 'network' | 'enumerators' | 'donors' | 'ingo' | 'studio',
      )
    )
      return false;
    return true;
  });

  return (
    <PageShell locale={locale} pathname="/catalogue">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">
            Catalogue · {filtered.length} of {all.length} courses
          </p>
          <h1>
            Courses, by <em>track</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            Filter by track, language, or audience. Cooperative-onboarding seats are free for
            Network nodes. Cohort-based courses run twice a year; self-paced courses are open on
            enrolment.
          </p>
        </div>
      </section>

      <FilterBar locale={locale} active={{ track, language, audience }} />

      <section className="mx-section">
        <div className="mx-container">
          {filtered.length === 0 ? (
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 24,
                color: 'var(--ink-muted)',
                margin: 0,
              }}
            >
              No courses match those filters.
            </p>
          ) : (
            <div
              className="mx-card"
              style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}
            >
              {filtered.map((c, i) => {
                const trackInfo = LEARN_TRACKS[c.track as keyof typeof LEARN_TRACKS];
                const accent = trackInfo?.accent ?? 'var(--ink-muted)';
                return (
                  <Link
                    key={c.id}
                    href={`/${locale}/catalogue/${c.slug}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr 220px 60px',
                      gap: 24,
                      padding: '28px 32px',
                      alignItems: 'center',
                      borderBottom:
                        i < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: STATUS_COLOR[c.status],
                        letterSpacing: '1px',
                      }}
                    >
                      {STATUS_LABEL[c.status]}
                    </span>
                    <div>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          letterSpacing: '1px',
                          color: accent,
                          textTransform: 'uppercase',
                        }}
                      >
                        {trackInfo?.label ?? c.track}
                      </span>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontStyle: 'italic',
                          fontWeight: 400,
                          fontSize: 24,
                          color: 'var(--ink)',
                          letterSpacing: '-0.3px',
                          margin: '8px 0 6px',
                          lineHeight: 1.25,
                        }}
                      >
                        {c.title}
                      </h3>
                      <p style={taglineStyle}>{c.tagline}</p>
                    </div>
                    <div style={metaColStyle}>
                      <span style={metaLabelStyle}>
                        {FORMAT_LABEL[c.format]} · {LEVEL_LABEL[c.level]}
                      </span>
                      <span style={metaLabelStyle}>
                        {(c.language ?? []).map((l) => LANGUAGE_LABEL[l]).join(' · ')}
                      </span>
                      <span style={metaLabelStyle}>{c.duration}</span>
                      <span style={{ ...metaLabelStyle, color: accent }}>
                        {c.price?.amount ?? '—'}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      style={{ color: accent, fontSize: 18, justifySelf: 'end' }}
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

interface FilterBarProps {
  locale: string;
  active: { track?: string; language?: string; audience?: string };
}

function FilterBar({ locale, active }: FilterBarProps) {
  const trackEntries = Object.entries(LEARN_TRACKS) as [
    keyof typeof LEARN_TRACKS,
    (typeof LEARN_TRACKS)[keyof typeof LEARN_TRACKS],
  ][];

  return (
    <section
      style={{
        background: 'var(--shell-warm)',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        padding: '24px 0',
      }}
    >
      <div className="mx-container" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <FilterRow
          label="Track"
          links={[
            { href: `/${locale}/catalogue`, label: 'All', active: !active.track },
            ...trackEntries.map(([key, t]) => ({
              href: `/${locale}/catalogue?track=${key}`,
              label: t.label,
              active: active.track === key,
            })),
          ]}
        />
        <FilterRow
          label="Language"
          links={[
            { href: `/${locale}/catalogue`, label: 'All', active: !active.language },
            {
              href: `/${locale}/catalogue?language=en`,
              label: 'English',
              active: active.language === 'en',
            },
            {
              href: `/${locale}/catalogue?language=ar`,
              label: 'العربية',
              active: active.language === 'ar',
            },
            {
              href: `/${locale}/catalogue?language=fr`,
              label: 'Français',
              active: active.language === 'fr',
            },
          ]}
        />
        <FilterRow
          label="Audience"
          links={[
            { href: `/${locale}/catalogue`, label: 'All', active: !active.audience },
            ...Object.entries(AUDIENCE_LABEL).map(([key, label]) => ({
              href: `/${locale}/catalogue?audience=${key}`,
              label,
              active: active.audience === key,
            })),
          ]}
        />
      </div>
    </section>
  );
}

function FilterRow({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string; active: boolean }[];
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          minWidth: 80,
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {links.map((l) => (
          <Link
            key={`${label}-${l.href}-${l.label}`}
            href={l.href}
            className="mx-filter"
            aria-pressed={l.active ? 'true' : undefined}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const taglineStyle: CSSProperties = {
  fontSize: 13,
  color: 'var(--ink-muted)',
  lineHeight: 1.55,
  margin: 0,
  maxWidth: '64ch',
};

const metaColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  textAlign: 'right',
};

const metaLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--ink-muted)',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
};
