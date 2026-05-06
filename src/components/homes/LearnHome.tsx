import { LEARN_TRACKS } from '@/content/learn-tracks';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Course } from '../../../payload-types';

interface LearnHomeProps {
  locale: string;
  /** Up to 6 featured courses across the tracks. */
  featured: Course[];
  /** Per-track counts shown on the track cards. */
  countsByTrack: Record<string, number>;
}

export function LearnHome({ locale, featured, countsByTrack }: LearnHomeProps) {
  return (
    <>
      <Hero locale={locale} />
      <TracksStrip locale={locale} countsByTrack={countsByTrack} />
      <FeaturedStrip locale={locale} featured={featured} />
      <CooperativeStrip locale={locale} />
      <FinalCTA locale={locale} />
    </>
  );
}

/* ──────────── Hero ──────────── */
function Hero({ locale }: { locale: string }) {
  return (
    <section style={{ padding: '80px 0 48px' }}>
      <div className="mx-container">
        <p className="mx-eyebrow">MERLx Learn</p>
        <h1 className="mx-h1-display" style={{ maxWidth: '22ch' }}>
          Learning that runs <em>where the work runs</em>.
        </h1>
        <p className="mx-lead" style={{ marginTop: 32, maxWidth: '60ch' }}>
          Cooperative onboarding for Network researchers and enumerators, advanced MERL for donors
          and INGO programme teams, operator certifications for the Optics Suite. The same practice
          that ships the engagements ships the courses.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
          <Link href={`/${locale}/catalogue`} className="mx-btn mx-btn--primary mx-btn--lg">
            Browse the catalogue →
          </Link>
          <Link href={`/${locale}/contact`} className="mx-btn mx-btn--ghost mx-btn--lg">
            Talk to a course lead
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────── Tracks ──────────── */
function TracksStrip({
  locale,
  countsByTrack,
}: {
  locale: string;
  countsByTrack: Record<string, number>;
}) {
  const tracks = Object.entries(LEARN_TRACKS) as [
    keyof typeof LEARN_TRACKS,
    (typeof LEARN_TRACKS)[keyof typeof LEARN_TRACKS],
  ][];
  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">Four tracks</p>
            <h2 className="mx-h2-section">
              Pick the track that <em>matches the seat</em>.
            </h2>
          </div>
          <p className="mx-lead">
            Cooperative onboarding is the floor for new nodes. Continuous learning keeps active
            nodes current. Advanced MERL is for the people who commission and oversee. Tool training
            is for operators of the Optics Suite.
          </p>
        </div>
        <div style={gridFour}>
          {tracks.map(([key, track]) => (
            <Link
              key={key}
              href={`/${locale}/catalogue?track=${key}`}
              className="mx-card"
              style={trackCardStyle}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '1.5px',
                  color: track.accent,
                  textTransform: 'uppercase',
                }}
              >
                {track.label}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 24,
                  margin: '12px 0 8px',
                  letterSpacing: '-0.4px',
                  color: 'var(--ink)',
                }}
              >
                {track.audience}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: 0 }}>
                {track.description}
              </p>
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 16,
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--ink-muted)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {countsByTrack[key] ?? 0} course{countsByTrack[key] === 1 ? '' : 's'}
                </span>
                <span aria-hidden="true" style={{ color: track.accent, fontSize: 18 }}>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────── Featured ──────────── */
function FeaturedStrip({ locale, featured }: { locale: string; featured: Course[] }) {
  if (featured.length === 0) return null;
  return (
    <section className="mx-section">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">Currently enrolling</p>
            <h2 className="mx-h2-section">
              Start <em>here</em>.
            </h2>
          </div>
          <p className="mx-lead">
            Six courses currently open or starting soon. Cooperative-onboarding seats are free for
            Network nodes. Cohort-based courses run twice a year.
          </p>
        </div>
        <div style={gridThree}>
          {featured.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} locale={locale} />
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <Link href={`/${locale}/catalogue`} className="mx-link-arrow">
            All courses →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course, locale }: { course: Course; locale: string }) {
  const trackInfo = LEARN_TRACKS[course.track as keyof typeof LEARN_TRACKS];
  return (
    <Link href={`/${locale}/catalogue/${course.slug}`} className="mx-card" style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '1px',
            color: trackInfo?.accent ?? 'var(--ink-muted)',
            textTransform: 'uppercase',
          }}
        >
          {trackInfo?.label ?? course.track}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--ink-faint)',
            letterSpacing: '0.5px',
          }}
        >
          {course.duration}
        </span>
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          fontSize: 20,
          margin: '16px 0 8px',
          letterSpacing: '-0.3px',
          color: 'var(--ink)',
          lineHeight: 1.25,
        }}
      >
        {course.title}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.55, margin: 0 }}>
        {course.tagline}
      </p>
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 16,
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--ink-muted)',
            letterSpacing: '0.5px',
          }}
        >
          {course.price?.amount ?? '—'}
        </span>
        <span
          aria-hidden="true"
          style={{ color: trackInfo?.accent ?? 'var(--ink-muted)', fontSize: 18 }}
        >
          →
        </span>
      </div>
    </Link>
  );
}

/* ──────────── Cooperative onboarding split ──────────── */
function CooperativeStrip({ locale }: { locale: string }) {
  return (
    <section className="mx-section mx-section--ink">
      <div className="mx-container">
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}
        >
          <div>
            <p className="mx-eyebrow">Becoming a Network node</p>
            <h2 className="mx-h2-section" style={{ color: 'var(--shell)' }}>
              The floor every new <em>cooperative</em> clears.
            </h2>
          </div>
          <div>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                color: 'rgba(245,243,238,0.78)',
                margin: '0 0 24px',
                maxWidth: '52ch',
              }}
            >
              Three foundation courses run as the methodological floor for Network admission. MERL
              foundations, conflict sensitivity, and the KII protocol. Free for new cooperatives in
              onboarding. Required before fieldwork begins.
            </p>
            <Link
              href={`/${locale}/catalogue?track=cooperative-onboarding`}
              className="mx-btn mx-btn--inverse"
            >
              Cooperative-onboarding curriculum →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────── Final CTA ──────────── */
function FinalCTA({ locale }: { locale: string }) {
  return (
    <section className="mx-section">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">Working with us</p>
            <h2 className="mx-h2-section">
              Custom curricula for <em>partner organisations</em>.
            </h2>
          </div>
          <p className="mx-lead">
            INGOs and donors with a specific MERL or methodology gap can commission a private cohort
            against the same instructor pool. Two cohorts per year, scoped to the partner.
            Subsidised seats available for low-resource partners.
          </p>
        </div>
        <Link href={`/${locale}/contact`} className="mx-btn mx-btn--primary">
          Talk to a course lead →
        </Link>
      </div>
    </section>
  );
}

const gridFour: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 16,
};

const gridThree: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 16,
};

const trackCardStyle: CSSProperties = {
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  textDecoration: 'none',
  minHeight: 220,
  background: 'var(--surface)',
};

const cardStyle: CSSProperties = {
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  textDecoration: 'none',
  minHeight: 200,
  background: 'var(--surface)',
};
