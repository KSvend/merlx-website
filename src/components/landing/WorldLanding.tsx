import '@/styles/landing.css';
import Image from 'next/image';
import Link from 'next/link';
import { WorldMapBackground } from './WorldMapBackground';

interface WorldLandingProps {
  locale: string;
}

/**
 * MERLx group landing.
 *
 * Built against the merlx-design-system (commit 2026-05-05): shell
 * background, Inter for UI, DM Serif Display only for the editorial
 * tagline, IBM Plex Mono only for data, deep-teal primary buttons in
 * sentence case, iris "x" in the wordmark, real logo SVG mark.
 *
 * The world-map backdrop is faint by default. Hovering the Studio CTA
 * fades in the PRISM hex bloom + EO satellite tile reveal over the
 * Horn of Africa; hovering the Network CTA fades in the federated
 * node pins + mesh.
 */
export function WorldLanding({ locale }: WorldLandingProps) {
  return (
    <div className="merlx-landing">
      <div className="merlx-landing-bg">
        <WorldMapBackground />
      </div>

      <div className="merlx-landing-hero">
        <div className="merlx-landing-mark">
          <Image src="/merlx-icon-dark.svg" alt="" width={64} height={50} priority unoptimized />
        </div>

        <p className="merlx-landing-eyebrow">v2026 · Company Profile</p>

        <h1 className="merlx-landing-wordmark">
          MERL<span className="merlx-landing-wordmark-x">x</span>
        </h1>

        <p className="merlx-landing-tagline">
          Advanced analytics for humanitarian and peacebuilding programming.
        </p>

        <div className="merlx-landing-rule" aria-hidden="true" />

        <nav className="merlx-landing-ctas" aria-label="Primary">
          <a
            href="https://studio.merlx.org"
            className="merlx-landing-cta merlx-landing-cta--studio"
          >
            Studio
          </a>
          <a
            href="https://network.merlx.org"
            className="merlx-landing-cta merlx-landing-cta--network"
          >
            Network
          </a>
          <Link
            href={`/${locale}/contact`}
            className="merlx-landing-cta merlx-landing-cta--contact"
          >
            Contact
          </Link>
        </nav>

        <p className="merlx-landing-foot">
          <span>Studio · technology</span>
          <span aria-hidden="true">·</span>
          <span>Network · MERL cooperatives</span>
        </p>
      </div>
    </div>
  );
}
