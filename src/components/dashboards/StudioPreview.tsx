/**
 * StudioPreview — the "live PRISM dashboard" fragment, ported from
 * MERLx Website.zip / src/HomePage.jsx HeroDashboardCard, simplified
 * to a single static tab. Used as the Studio side of the group home.
 */

import { LineChart } from '@/components/dataviz/LineChart';
import type { CSSProperties } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const actual = [42, 45, 51, 56, 62, 71, 78, 74];
const forecast = [42, 45, 51, 56, 62, 71, 78, 74, 81, 86, 84, 79];

export function StudioPreview() {
  return (
    <div className="mx-card" style={cardStyle}>
      <div style={chromeRowStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 100, background: 'var(--ember)' }} />
          <span style={chromeLabelStyle}>PRISM · Horn of Africa risk forecast</span>
        </div>
        <span style={chromeMetaStyle}>UPDATED 04 MAY 2026 · 14:22 UTC</span>
      </div>

      <div style={tabRowStyle}>
        {['Forecast', 'Indicators', 'Regions'].map((t, i) => (
          <span
            key={t}
            style={{
              ...tabStyle,
              fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? 'var(--ink)' : 'var(--ink-muted)',
              borderBottom: i === 0 ? '2px solid var(--deep-teal)' : '2px solid transparent',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div style={{ padding: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 16,
          }}
        >
          <div>
            <p className="mx-mono-caption" style={{ margin: 0 }}>
              FOOD INSECURITY · IPC PHASE 3+
            </p>
            <p style={statValueStyle}>
              78
              <sup style={statSupStyle}>%</sup>
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--ember)', fontWeight: 500 }}>
              ↑ 6.2pp vs. 12-week avg
            </p>
          </div>
          <div
            style={{ textAlign: 'right', fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.5 }}
          >
            <div>
              <span style={{ ...legendDotStyle, background: 'var(--deep-teal)' }} />
              Observed
            </div>
            <div>
              <span
                style={{
                  ...legendDotStyle,
                  background: 'var(--ember)',
                  borderTop: '1px dashed var(--ember)',
                }}
              />
              Forecast (4mo)
            </div>
          </div>
        </div>

        <LineChart
          width={500}
          height={180}
          series={[
            {
              data: forecast.map((y, i) => ({ x: months[i], y: i < 7 ? null : y })),
              color: 'var(--ember)',
              dashed: true,
            },
            {
              data: actual.map((y, i) => ({ x: months[i], y })),
              color: 'var(--deep-teal)',
              fill: true,
              dots: true,
            },
          ]}
          yMin={20}
          yMax={100}
        />

        <div style={statsGridStyle}>
          {[
            { l: 'Forecast confidence', v: '0.84' },
            { l: 'Lead time', v: '14 wks' },
            { l: 'Signal sources', v: '24' },
          ].map((m) => (
            <div key={m.l} style={statTileStyle}>
              <p className="mx-mono-caption" style={{ margin: 0, fontSize: 9 }}>
                {m.l.toUpperCase()}
              </p>
              <p
                style={{
                  margin: '4px 0 0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--ink)',
                }}
              >
                {m.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = { padding: 0, overflow: 'hidden', background: 'var(--surface)' };

const chromeRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid var(--border-light)',
};

const chromeLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--ink-muted)',
  letterSpacing: '0.5px',
};

const chromeMetaStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--ink-faint)',
  letterSpacing: '0.5px',
};

const tabRowStyle: CSSProperties = {
  display: 'flex',
  borderBottom: '1px solid var(--border-light)',
  padding: '0 16px',
};

const tabStyle: CSSProperties = {
  padding: '12px 16px 14px',
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  letterSpacing: '0.04em',
  marginBottom: -1,
};

const statValueStyle: CSSProperties = {
  margin: '4px 0 0',
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontSize: 36,
  lineHeight: 1,
  color: 'var(--ink)',
};

const statSupStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontStyle: 'normal',
  fontSize: 13,
  color: 'var(--ink-muted)',
};

const legendDotStyle: CSSProperties = {
  display: 'inline-block',
  width: 10,
  height: 1.5,
  verticalAlign: 'middle',
  marginRight: 6,
};

const statsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 1,
  background: 'var(--border-light)',
  marginTop: 20,
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-sm)',
  overflow: 'hidden',
};

const statTileStyle: CSSProperties = {
  background: 'var(--surface)',
  padding: '12px 14px',
};
