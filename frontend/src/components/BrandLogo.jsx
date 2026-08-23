import React from 'react';

/**
 * BrandLogo — "River" wordmark
 * Reference: 6_STYLE_GUIDE.md §1 + uploaded logo reference image
 *
 * Visual spec:
 * - Playfair Display italic 800 wordmark "River"
 * - Blue gradient: #60A5FA → #2E7CD6 → #1E5FA8 via background-clip:text
 * - Small green leaf SVG on the "i" dot
 * - Two wave SVG lines beneath the wordmark (same blue gradient)
 * - Hero size: logo-pop-in spring animation; all other sizes: static
 */

// Leaf SVG accent (sits above the wordmark text, positioned over the 'i')
function LeafAccent({ scale = 1 }) {
  return (
    <svg
      width={10 * scale}
      height={13 * scale}
      viewBox="0 0 10 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <path
        d="M5 0.5C5 0.5 1 3.5 1 6.5C1 9 2.8 11 5 11C7.2 11 9 9 9 6.5C9 3.5 5 0.5 5 0.5Z"
        fill="url(#leafGrad)"
      />
      <line x1="5" y1="11" x2="5" y2="13" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" />
      <defs>
        <linearGradient id="leafGrad" x1="5" y1="0" x2="5" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Wave SVG lines beneath the wordmark (matches reference image)
function WaveLines({ width, color1 = '#60A5FA', color2 = '#2E7CD6' }) {
  return (
    <svg
      width={width}
      height={18}
      viewBox={`0 0 ${width} 18`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', marginTop: 2 }}
    >
      <defs>
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color1} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Wave 1 — primary */}
      <path
        d={`M4 5 C${width * 0.15} 1, ${width * 0.3} 9, ${width * 0.5} 5 C${width * 0.7} 1, ${width * 0.85} 9, ${width - 4} 5`}
        stroke="url(#waveGrad1)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Wave 2 — secondary, softer */}
      <path
        d={`M4 12 C${width * 0.15} 8, ${width * 0.3} 16, ${width * 0.5} 12 C${width * 0.7} 8, ${width * 0.85} 16, ${width - 4} 12`}
        stroke="url(#waveGrad2)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BrandLogo({ size = 'medium', className = '', showWordmark = true }) {
  // Size map: wordmark font-size, wave width, leaf scale, show-tagline
  const sizeMap = {
    small:  { fontSize: '1.35rem', waveWidth: 72,  leafScale: 0.75, tagline: false, heroAnim: false },
    medium: { fontSize: '1.75rem', waveWidth: 96,  leafScale: 0.9,  tagline: false, heroAnim: false },
    large:  { fontSize: '2.5rem',  waveWidth: 140, leafScale: 1.2,  tagline: true,  heroAnim: false },
    hero:   { fontSize: '4rem',    waveWidth: 220, leafScale: 1.8,  tagline: true,  heroAnim: true  },
  };

  const cfg = sizeMap[size] || sizeMap.medium;

  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      {showWordmark && (
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* ── Wordmark ─────────────────────────── */}
          <span
            className="river-logo"
            style={{
              fontSize: cfg.fontSize,
              ...(cfg.heroAnim ? {} : {}), // hero anim applied via .river-logo--hero class
            }}
            // Apply hero animation class only on hero size
            data-hero={cfg.heroAnim ? 'true' : undefined}
            /* We apply class directly via a wrapper below */
          >
            {/* We split "R" | "i" | "ver" so we can position the leaf over "i" */}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              {/* "River" as one piece — Playfair Display handles the script look */}
              <span
                className={`river-logo ${cfg.heroAnim ? 'river-logo--hero' : 'river-logo--header'}`}
                style={{ fontSize: cfg.fontSize }}
              >
                River
              </span>

              {/* Leaf accent — floats above the 'i' character */}
              {/* Position: roughly 38% from left (where 'i' sits in 'River') */}
              <span
                style={{
                  position: 'absolute',
                  top: `calc(-${cfg.leafScale * 10}px - 2px)`,
                  left: '38%',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <LeafAccent scale={cfg.leafScale} />
              </span>
            </span>
          </span>

          {/* ── Wave lines below wordmark ─────────── */}
          <WaveLines width={cfg.waveWidth} />

          {/* ── Tagline (large / hero only) ───────── */}
          {cfg.tagline && (
            <span
              style={{
                marginTop: 6,
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontStyle: 'normal',
                WebkitTextFillColor: 'var(--text-secondary)',
              }}
            >
              Water Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
}
