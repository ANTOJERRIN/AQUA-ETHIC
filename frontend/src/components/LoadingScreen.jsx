import React from 'react';
import BrandLogo from './BrandLogo';

export default function LoadingScreen({ onLoaded }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Hero Logo — logo-pop-in spring animation applied via river-logo--hero class in BrandLogo */}
      <div className="flex flex-col items-center justify-center">
        <BrandLogo size="hero" showWordmark={true} />

        {/* Tagline */}
        <p
          className="mt-6 text-sm md:text-base font-medium tracking-wide animate-pulse-slow"
          style={{ color: 'var(--text-secondary)' }}
        >
          Synchronizing Sentinel-2 MSI &amp; Ground Buoy Sensors...
        </p>

        {/* Live pulse dots */}
        <div className="mt-8 flex items-center gap-3">
          {[0, 0.15, 0.3].map((delay, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full animate-bounce"
              style={{
                background: 'var(--accent-blue)',
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
