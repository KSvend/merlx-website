import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import {
  AUDIENCE_LABEL,
  FORMAT_LABEL,
  LANGUAGE_LABEL,
  LEARN_TRACKS,
  LEVEL_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
} from '@/content/learn-tracks';
import { findCourseBySlug } from '@/lib/learn-cms';
import { isLearnTenant, requireLearnTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isLearnTenant(headerList)) notFound();

  const payload = await getPayload({ config });
  const tenant = await requireLearnTenant(headerList, payload);
  const course = await findCourseBySlug({ tenant, slug, locale });
  if (!course) notFound();

  const trackInfo = LEARN_TRACKS[course.track as keyof typeof LEARN_TRACKS];
  const accent = trackInfo?.accent ?? 'var(--ink-muted)';

  // Enrolment CTA: route to /contact while no LMS is wired.
  const enrolmentHref = course.enrolmentUrl ?? `/${locale}/contact`;
  const enrolmentExternal = Boolean(course.enrolmentUrl);

  return (
    <PageShell locale={locale} pathname={`/catalogue/${slug}`}>
      {/* Header strip */}
      <section className="mx-section">
        <div className="mx-container">
          <div style={headerRowStyle}>
            <div>
              <span style={{ ...trackPillStyle, color: accent, borderColor: accent }}>
                {trackInfo?.label ?? course.track}
              </span>
            </div>
            <span style={{ ...statusPillStyle, color: STATUS_COLOR[course.status] }}>
              {STATUS_LABEL[course.status]}
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: 'clamp(36px, 4.5vw, 60px)',
              lineHeight: 1.05,
              letterSpacing: '-1px',
              margin: '24px 0',
              maxWidth: '24ch',
              textWrap: 'balance',
            }}
          >
            {course.title}
          </h1>

          <p style={taglineStyle}>{course.tagline}</p>

          <div style={ctaRowStyle}>
            <Link
              href={enrolmentHref}
              {...(enrolmentExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="mx-btn mx-btn--primary mx-btn--lg"
            >
              {course.enrolmentUrl ? 'Go to enrolment →' : 'Enrol or enquire →'}
            </Link>
            <Link href={`/${locale}/catalogue`} className="mx-btn mx-btn--ghost mx-btn--lg">
              ← All courses
            </Link>
          </div>

          {/* Quick-fact strip */}
          <div style={factStripStyle}>
            <Fact label="Format" value={FORMAT_LABEL[course.format]} />
            <Fact label="Level" value={LEVEL_LABEL[course.level]} />
            <Fact label="Duration" value={course.duration} />
            <Fact
              label="Languages"
              value={(course.language ?? []).map((l) => LANGUAGE_LABEL[l]).join(' · ')}
            />
            <Fact
              label="Audience"
              value={(course.audience ?? []).map((a) => AUDIENCE_LABEL[a]).join(', ')}
            />
            <Fact
              label="Price"
              value={course.price?.amount ?? '—'}
              note={course.price?.note ?? undefined}
            />
            {course.cohort?.startsOn ? (
              <Fact
                label="Cohort"
                value={`${course.cohort.startsOn}${course.cohort.endsOn ? ` — ${course.cohort.endsOn}` : ''}`}
                note={course.cohort.cohortSize ?? undefined}
              />
            ) : null}
            {course.cohort?.enrolmentDeadline ? (
              <Fact label="Enrolment by" value={course.cohort.enrolmentDeadline} />
            ) : null}
            {course.requiredForNodeAdmission ? (
              <Fact label="Network" value="Required for node admission" />
            ) : null}
            {course.certifies ? <Fact label="Certificate" value="Issued on completion" /> : null}
          </div>
        </div>
      </section>

      {/* Description */}
      {course.description ? (
        <section className="mx-section mx-section--shell-warm">
          <div className="mx-container-narrow">
            <p className="mx-eyebrow">About the course</p>
            {/* biome-ignore lint/suspicious/noExplicitAny: Lexical body shape */}
            <RichTextRenderer data={course.description as any} />
          </div>
        </section>
      ) : null}

      {/* Learning outcomes */}
      {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
        <section className="mx-section">
          <div className="mx-container">
            <div style={twoColumnLayout}>
              <div>
                <p className="mx-eyebrow">Learning outcomes</p>
                <h2 className="mx-h2-section">
                  By the end you will <em>be able to</em>:
                </h2>
              </div>
              <ol style={outcomesListStyle}>
                {course.learningOutcomes.map((o, i) => (
                  <li key={`${o.outcome}-${i}`} style={outcomeItemStyle}>
                    <span style={{ ...outcomeNumberStyle, color: accent }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{o.outcome}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : null}

      {/* Outline */}
      {course.outline && course.outline.length > 0 ? (
        <section className="mx-section mx-section--shell-warm">
          <div className="mx-container">
            <p className="mx-eyebrow">Outline</p>
            <h2 className="mx-h2-section">
              The <em>shape</em> of the course.
            </h2>
            <div
              className="mx-card"
              style={{
                padding: 0,
                overflow: 'hidden',
                background: 'var(--surface)',
                marginTop: 32,
              }}
            >
              {course.outline.map((m, i) => (
                <div
                  key={`${m.title}-${i}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 140px',
                    gap: 24,
                    padding: '24px 32px',
                    alignItems: 'baseline',
                    borderBottom:
                      i < (course.outline?.length ?? 0) - 1
                        ? '1px solid var(--border-light)'
                        : 'none',
                  }}
                >
                  <span style={{ ...outcomeNumberStyle, color: accent, paddingTop: 0 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 600,
                        fontSize: 17,
                        margin: '0 0 6px',
                        color: 'var(--ink)',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      {m.title}
                    </h3>
                    {m.summary ? (
                      <p
                        style={{
                          fontSize: 13,
                          color: 'var(--ink-muted)',
                          lineHeight: 1.55,
                          margin: 0,
                          maxWidth: '64ch',
                        }}
                      >
                        {m.summary}
                      </p>
                    ) : null}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--ink-muted)',
                      letterSpacing: '0.5px',
                      textAlign: 'right',
                    }}
                  >
                    {m.duration ?? ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Prerequisites */}
      {course.prerequisites && course.prerequisites.length > 0 ? (
        <section className="mx-section">
          <div className="mx-container-narrow">
            <p className="mx-eyebrow">Prerequisites</p>
            <ul style={prereqListStyle}>
              {course.prerequisites.map((p, i) => (
                <li key={`${p.item}-${i}`} style={prereqItemStyle}>
                  <span aria-hidden="true" style={{ color: 'var(--ink-faint)' }}>
                    ·
                  </span>
                  {p.item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="mx-section">
        <div className="mx-container">
          <Link
            href={enrolmentHref}
            {...(enrolmentExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="mx-btn mx-btn--primary mx-btn--lg"
          >
            {course.enrolmentUrl ? 'Go to enrolment →' : 'Enrol or enquire →'}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function Fact({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={factCellStyle}>
      <p style={factLabelStyle}>{label}</p>
      <p style={factValueStyle}>{value}</p>
      {note ? <p style={factNoteStyle}>{note}</p> : null}
    </div>
  );
}

const headerRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 16,
  borderBottom: '1px solid var(--border-light)',
};

const trackPillStyle: CSSProperties = {
  padding: '6px 12px',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '1px',
  border: '1px solid currentColor',
  background: 'transparent',
  textTransform: 'uppercase',
};

const statusPillStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '1px',
  textTransform: 'uppercase',
};

const taglineStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: 'clamp(22px, 2.6vw, 28px)',
  lineHeight: 1.3,
  color: 'var(--ink)',
  margin: '0 0 32px',
  maxWidth: '52ch',
  textWrap: 'balance',
};

const ctaRowStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  marginBottom: 48,
};

const factStripStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 1,
  background: 'var(--border-light)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
};

const factCellStyle: CSSProperties = {
  background: 'var(--surface)',
  padding: '20px 22px',
};

const factLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--ink-faint)',
  margin: '0 0 6px',
};

const factValueStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  fontSize: 14,
  color: 'var(--ink)',
  margin: 0,
  letterSpacing: '-0.1px',
};

const factNoteStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 11,
  color: 'var(--ink-muted)',
  margin: '6px 0 0',
  lineHeight: 1.5,
};

const twoColumnLayout: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
  gap: 64,
  alignItems: 'start',
};

const outcomesListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const outcomeItemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '40px 1fr',
  gap: 16,
  alignItems: 'baseline',
  fontSize: 15,
  lineHeight: 1.55,
  color: 'var(--ink)',
};

const outcomeNumberStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.5px',
  paddingTop: 3,
};

const prereqListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '24px 0 0',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const prereqItemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '20px 1fr',
  gap: 10,
  fontSize: 14,
  lineHeight: 1.55,
  color: 'var(--ink)',
};
