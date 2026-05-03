import Link from 'next/link';
import '@/styles/chooser.css';
import { WorldMapBackground } from './WorldMapBackground';

interface WorldLandingProps {
  locale: string;
}

export function WorldLanding({ locale }: WorldLandingProps) {
  return (
    <div className="world-landing">
      <div className="world-landing-bg">
        <WorldMapBackground />
      </div>

      <div className="world-landing-hero">
        <p className="world-landing-eyebrow">MERLx · v2026</p>
        <h1 className="world-landing-title">
          MERL<span className="world-landing-title-x">x</span>
        </h1>
        <p className="world-landing-tagline">
          Advanced analytics for humanitarian and peacebuilding programming.
        </p>
        <div className="world-landing-rule" />

        <div className="world-landing-ctas">
          <a
            href="https://studio.merlx.org"
            className="world-landing-cta world-landing-cta--studio"
          >
            <span>Studio</span>
            <span className="world-landing-cta-tag">The technology studio</span>
            <span className="world-landing-cta-arrow">→</span>
          </a>
          <a
            href="https://network.merlx.org"
            className="world-landing-cta world-landing-cta--network"
          >
            <span>Network</span>
            <span className="world-landing-cta-tag">The MERL cooperative federation</span>
            <span className="world-landing-cta-arrow">→</span>
          </a>
        </div>

        <Link href={`/${locale}/contact`} className="world-landing-contact">
          Contact ↗
        </Link>
      </div>
    </div>
  );
}
