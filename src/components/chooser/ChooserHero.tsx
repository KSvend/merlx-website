import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { NetworkBackground } from './NetworkBackground';
import { StudioBackground } from './StudioBackground';
import '@/styles/chooser.css';

export async function ChooserHero() {
  const t = await getTranslations('chooser');

  return (
    <div className="chooser">
      {/* Studio (left) */}
      <div className="chooser-half chooser-half--studio">
        <div className="chooser-bg">
          <StudioBackground />
        </div>
        <div className="chooser-content">
          <div className="chooser-tag">
            <span className="chooser-tag-swatch" />
            {t('studioTag')}
          </div>
          <h2 className="chooser-name">
            MERL<em>x</em> Studio
          </h2>
          <p className="chooser-tagline">{t('studioTagline')}</p>
          <div className="chooser-rule" />
          <p className="chooser-body">{t('studioBody')}</p>
          <ul className="chooser-list">
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('studioBullet1')}</span>
            </li>
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('studioBullet2')}</span>
            </li>
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('studioBullet3')}</span>
            </li>
          </ul>
          <div className="chooser-foot">
            <Link href="https://studio.merlx.org" className="chooser-cta">
              {t('studioCta')}
            </Link>
            <span className="chooser-domain">studio.merlx.org</span>
          </div>
        </div>
      </div>

      {/* Network (right) */}
      <div className="chooser-half chooser-half--network">
        <div className="chooser-bg">
          <NetworkBackground />
        </div>
        <div className="chooser-content">
          <div className="chooser-tag">
            <span className="chooser-tag-swatch" />
            {t('networkTag')}
          </div>
          <h2 className="chooser-name">
            MERL<em>x</em> Network
          </h2>
          <p className="chooser-tagline">{t('networkTagline')}</p>
          <div className="chooser-rule" />
          <p className="chooser-body">{t('networkBody')}</p>
          <ul className="chooser-list">
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('networkBullet1')}</span>
            </li>
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('networkBullet2')}</span>
            </li>
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('networkBullet3')}</span>
            </li>
          </ul>
          <div className="chooser-foot">
            <Link href="https://network.merlx.org" className="chooser-cta">
              {t('networkCta')}
            </Link>
            <span className="chooser-domain">network.merlx.org</span>
          </div>
        </div>
      </div>
    </div>
  );
}
