import React from 'react';
import BrandLogo from './BrandLogo';

export default function Footer({ setCurrentRoute }) {
  return (
    <footer
      className="w-full py-12 border-t mt-auto transition-colors duration-200"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-6 max-w-container-max-width mx-auto">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <BrandLogo size="small" showWordmark={true} />
          <span className="text-xs text-secondary dark:text-gray-400 mt-1">
            Real-Time Satellite & Buoy Environmental Telemetry
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap gap-6 items-center justify-center text-sm font-medium text-on-surface-variant dark:text-gray-300">
          <button onClick={() => setCurrentRoute?.('location')} className="hover:text-primary dark:hover:text-primary-fixed transition-colors">
            Locations
          </button>
          <button onClick={() => setCurrentRoute?.('purity')} className="hover:text-primary dark:hover:text-primary-fixed transition-colors">
            Purity Reports
          </button>
          <button onClick={() => setCurrentRoute?.('account')} className="hover:text-primary dark:hover:text-primary-fixed transition-colors">
            Monitoring History
          </button>
          <a href="#methodology" onClick={(e) => { e.preventDefault(); alert("River Methodology: Sensor readings are cryptographically hashed and verified against Sentinel-2 MSI spectral indices (NDTI/NDCI)."); }} className="hover:text-primary dark:hover:text-primary-fixed transition-colors">
            Data Methodology
          </a>
        </nav>

        {/* Copyright & Status */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--status-safe)' }}>
            <span className="pulse-dot" style={{ width: 8, height: 8 }} />
            <span>Telemetry Network Live</span>
          </div>
          <span className="text-xs text-secondary dark:text-gray-400">
            © {new Date().getFullYear()} River Water Monitoring. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
