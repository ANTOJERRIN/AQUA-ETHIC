import React from 'react';

/**
 * RiverBackdrop Component
 * Renders the luxury 3D River badge ('Gemini_Generated_Image_bi1jc5bi1jc5bi1j.jpg') 
 * behind the app layout with customizable blend modes, opacities, and positioning.
 */
export default function RiverBackdrop({ config, darkMode }) {
  const {
    imageSrc = '/Gemini_Generated_Image_bi1jc5bi1jc5bi1j.jpg',
    fitMode = 'ambient-hero', // 'ambient-hero', 'full-cover', 'corner-crest', 'split-duo'
    opacity = 22,
    blur = 0,
    scale = 100,
    blendMode = 'normal',
    inverted = false,
    glowIntensity = 30,
    showNoise = true,
  } = config || {};

  // Compute transform & placement style based on fit mode
  const getFitStyles = () => {
    switch (fitMode) {
      case 'full-cover':
        return {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          transform: `scale(${scale / 100})`,
        };
      case 'corner-crest':
        return {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'contain',
          backgroundPosition: 'calc(100% - 40px) 100px',
          backgroundRepeat: 'no-repeat',
          maxWidth: '650px',
          maxHeight: '450px',
          right: '5%',
          top: '12%',
          transform: `scale(${scale / 100})`,
        };
      case 'split-duo':
        return {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `scale(${scale / 100})`,
        };
      case 'ambient-hero':
      default:
        return {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          maxWidth: '1200px',
          maxHeight: '700px',
          margin: '0 auto',
          transform: `scale(${scale / 100})`,
        };
    }
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-all duration-500 ease-out"
      aria-hidden="true"
    >
      {/* 1. Ambient Lighting Glow Behind the Emblem */}
      {glowIntensity > 0 && (
        <div 
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
          style={{ opacity: (glowIntensity / 100) }}
        >
          <div 
            className="w-[850px] h-[500px] rounded-full blur-[110px] pointer-events-none transition-all duration-700"
            style={{
              background: darkMode
                ? 'radial-gradient(ellipse at center, rgba(46, 124, 214, 0.28) 0%, rgba(30, 95, 168, 0.12) 45%, transparent 75%)'
                : 'radial-gradient(ellipse at center, rgba(96, 165, 250, 0.35) 0%, rgba(219, 234, 254, 0.25) 50%, transparent 80%)'
            }}
          />
        </div>
      )}

      {/* 2. Main Luxury 3D Background Image Layer */}
      <div
        className="w-full h-full absolute inset-0 transition-all duration-300 ease-out"
        style={{
          ...getFitStyles(),
          opacity: opacity / 100,
          filter: `blur(${blur}px) ${inverted ? 'invert(1) hue-rotate(180deg)' : ''} ${darkMode ? 'contrast(1.1) brightness(0.95)' : 'contrast(1.02)'}`,
          mixBlendMode: blendMode,
        }}
      />

      {/* 3. Radial Vignette Overlay (Provides high-end depth and smooth edge fade) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{
          background: darkMode
            ? 'radial-gradient(circle at 50% 45%, transparent 35%, rgba(11, 15, 23, 0.65) 85%, rgba(11, 15, 23, 0.95) 100%)'
            : 'radial-gradient(circle at 50% 45%, transparent 30%, rgba(247, 249, 252, 0.55) 75%, rgba(247, 249, 252, 0.9) 100%)'
        }}
      />

      {/* 4. Subtle Porsche Brushed Texture / Film Grain (Optional luxury accent) */}
      {showNoise && (
        <div 
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      )}
    </div>
  );
}
