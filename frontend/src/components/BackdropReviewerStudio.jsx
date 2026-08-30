import React, { useState } from 'react';
import { 
  Sparkles, 
  Sliders, 
  Eye, 
  X, 
  RotateCcw, 
  Check, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Image as ImageIcon,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const PRESETS = {
  porscheHero: {
    name: 'Porsche Luxury Emblem (Hero)',
    description: '3D embossed emblem centered with soft radial glow and subtle 24% ambient opacity.',
    imageSrc: '/Gemini_Generated_Image_bi1jc5bi1jc5bi1j.jpg',
    fitMode: 'ambient-hero',
    opacity: 24,
    blur: 0,
    scale: 100,
    blendMode: 'normal',
    glowIntensity: 45,
    inverted: false,
  },
  watermarkCorner: {
    name: 'Subtle Crest Watermark',
    description: 'Minimalist 14% opacity luxury crest positioned in the top-right backdrop.',
    imageSrc: '/Gemini_Generated_Image_bi1jc5bi1jc5bi1j.jpg',
    fitMode: 'corner-crest',
    opacity: 16,
    blur: 0,
    scale: 85,
    blendMode: 'normal',
    glowIntensity: 15,
    inverted: false,
  },
  midnightRiver: {
    name: 'Midnight Glowing River',
    description: 'High-tech illuminated emblem with enhanced glow and soft-light blending for dark mode.',
    imageSrc: '/Gemini_Generated_Image_bi1jc5bi1jc5bi1j.jpg',
    fitMode: 'ambient-hero',
    opacity: 38,
    blur: 0,
    scale: 105,
    blendMode: 'luminosity',
    glowIntensity: 80,
    inverted: true,
  },
  fullShowcase: {
    name: 'Full High-Contrast Review',
    description: 'High 70% opacity showcase mode to inspect 3D paper craft textures and wave contours.',
    imageSrc: '/Gemini_Generated_Image_bi1jc5bi1jc5bi1j.jpg',
    fitMode: 'ambient-hero',
    opacity: 70,
    blur: 0,
    scale: 100,
    blendMode: 'normal',
    glowIntensity: 60,
    inverted: false,
  },
  pureScript: {
    name: 'Pure Script Variant',
    description: 'Alternative flowing calligraphy emblem variant without pill border.',
    imageSrc: '/Gemini_Generated_Image_yq1y0syq1y0syq1y.jpg',
    fitMode: 'ambient-hero',
    opacity: 22,
    blur: 0,
    scale: 100,
    blendMode: 'normal',
    glowIntensity: 40,
    inverted: false,
  }
};

export default function BackdropReviewerStudio({
  config,
  setConfig,
  darkMode,
  setDarkMode,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' or 'controls'

  const applyPreset = (presetKey) => {
    if (PRESETS[presetKey]) {
      setConfig((prev) => ({
        ...prev,
        ...PRESETS[presetKey],
      }));
    }
  };

  const handleReset = () => {
    applyPreset('porscheHero');
  };

  return (
    <>
      {/* Floating Reviewer Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full font-semibold text-xs md:text-sm tracking-wide shadow-2xl transition-all duration-300 backdrop-blur-xl border ${
            isOpen 
              ? 'bg-primary text-white border-primary-light ring-4 ring-primary/20 scale-105' 
              : 'bg-white/90 dark:bg-dark-surface/90 text-on-surface dark:text-white border-border-subtle dark:border-dark-border hover:border-primary hover:scale-105'
          }`}
          title="Review Porsche Background & Fit Options"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>Porsche Look Reviewer</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/20 text-primary dark:text-primary-fixed font-bold uppercase">
            {config.opacity}% Opacity
          </span>
        </button>
      </div>

      {/* Floating Reviewer Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-[420px] bg-surface-container-lowest/95 dark:bg-[#121722]/95 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-pop-in text-on-surface dark:text-gray-100">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle dark:border-dark-border bg-surface-container-low/50 dark:bg-dark-card/40">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-accent-blue-light flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight text-on-surface dark:text-white">
                  Porsche Background Studio
                </h3>
                <p className="text-[11px] text-on-surface-variant dark:text-gray-400">
                  Live review of <code className="text-primary dark:text-primary-fixed">Gemini_Generated_Image_bi1jc5bi1jc5bi1j.jpg</code>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                title="Reset to default Porsche look"
                className="p-1.5 rounded-lg text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-surface-variant dark:hover:bg-dark-card transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant dark:text-gray-400 hover:text-red-500 hover:bg-surface-variant dark:hover:bg-dark-card transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border-subtle dark:border-dark-border text-xs font-semibold">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                activeTab === 'presets'
                  ? 'border-primary text-primary dark:text-primary-fixed bg-primary/5'
                  : 'border-transparent text-on-surface-variant dark:text-gray-400 hover:text-on-surface'
              }`}
            >
              Curated Presets ({Object.keys(PRESETS).length})
            </button>
            <button
              onClick={() => setActiveTab('controls')}
              className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                activeTab === 'controls'
                  ? 'border-primary text-primary dark:text-primary-fixed bg-primary/5'
                  : 'border-transparent text-on-surface-variant dark:text-gray-400 hover:text-on-surface'
              }`}
            >
              Precision Controls &amp; Sliders
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 max-h-[440px] overflow-y-auto space-y-4 text-xs">
            
            {/* TAB 1: PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-on-surface-variant dark:text-gray-400 leading-relaxed">
                  Select a tailored aesthetic to instantly review how the 3D emblem blends into the workspace:
                </p>

                {Object.entries(PRESETS).map(([key, preset]) => {
                  const isCurrent = 
                    config.fitMode === preset.fitMode && 
                    config.opacity === preset.opacity &&
                    config.imageSrc === preset.imageSrc;

                  return (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                        isCurrent
                          ? 'border-primary bg-primary/10 dark:bg-primary/20 ring-1 ring-primary'
                          : 'border-border-subtle dark:border-dark-border bg-surface-container-lowest dark:bg-dark-card/60 hover:border-primary/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-on-surface dark:text-white">
                            {preset.name}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-primary text-white uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-on-surface-variant dark:text-gray-400 leading-normal">
                          {preset.description}
                        </p>
                      </div>

                      <div className="shrink-0 text-right text-[10px] text-on-surface-variant dark:text-gray-400 font-mono mt-0.5">
                        {preset.opacity}% opac
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB 2: PRECISION CONTROLS */}
            {activeTab === 'controls' && (
              <div className="space-y-4">
                
                {/* 1. Image Choice */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface dark:text-gray-200 flex items-center justify-between">
                    <span>Emblem Asset</span>
                    <span className="text-[10px] text-primary dark:text-primary-fixed font-mono">
                      {config.imageSrc.includes('bi1jc5') ? '3D Pill Badge' : 'Pure Script'}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, imageSrc: '/Gemini_Generated_Image_bi1jc5bi1jc5bi1j.jpg' }))}
                      className={`p-2 rounded-lg border text-center font-medium transition-all ${
                        config.imageSrc.includes('bi1jc5')
                          ? 'border-primary bg-primary/10 text-primary dark:text-white font-bold'
                          : 'border-border-subtle dark:border-dark-border bg-surface-container-lowest dark:bg-dark-card'
                      }`}
                    >
                      3D Embossed Badge
                    </button>
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, imageSrc: '/Gemini_Generated_Image_yq1y0syq1y0syq1y.jpg' }))}
                      className={`p-2 rounded-lg border text-center font-medium transition-all ${
                        config.imageSrc.includes('yq1y0s')
                          ? 'border-primary bg-primary/10 text-primary dark:text-white font-bold'
                          : 'border-border-subtle dark:border-dark-border bg-surface-container-lowest dark:bg-dark-card'
                      }`}
                    >
                      Pure River Script
                    </button>
                  </div>
                </div>

                {/* 2. Fit & Placement Mode */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface dark:text-gray-200">
                    Fit &amp; Placement Layout
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'ambient-hero', label: 'Centered Hero' },
                      { id: 'corner-crest', label: 'Corner Crest' },
                      { id: 'full-cover', label: 'Full Cover' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setConfig(prev => ({ ...prev, fitMode: mode.id }))}
                        className={`p-2 rounded-lg border text-center font-medium transition-all ${
                          config.fitMode === mode.id
                            ? 'border-primary bg-primary/10 text-primary dark:text-white font-bold'
                            : 'border-border-subtle dark:border-dark-border bg-surface-container-lowest dark:bg-dark-card'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Opacity Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-on-surface dark:text-gray-200">
                      Background Opacity
                    </label>
                    <span className="font-mono text-primary dark:text-primary-fixed font-bold">
                      {config.opacity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={config.opacity}
                    onChange={(e) => setConfig(prev => ({ ...prev, opacity: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>0% (Hidden)</span>
                    <span>20% (Subtle Porsche)</span>
                    <span>100% (Solid)</span>
                  </div>
                </div>

                {/* 4. Glow Intensity Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-on-surface dark:text-gray-200">
                      Radial Ambient Aura Glow
                    </label>
                    <span className="font-mono text-primary dark:text-primary-fixed font-bold">
                      {config.glowIntensity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={config.glowIntensity}
                    onChange={(e) => setConfig(prev => ({ ...prev, glowIntensity: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* 5. Scale Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-on-surface dark:text-gray-200">
                      Emblem Scale
                    </label>
                    <span className="font-mono text-primary dark:text-primary-fixed font-bold">
                      {config.scale}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="175"
                    step="5"
                    value={config.scale}
                    onChange={(e) => setConfig(prev => ({ ...prev, scale: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* 6. Blur / Glass Frost Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-on-surface dark:text-gray-200">
                      Frosted Blur
                    </label>
                    <span className="font-mono text-primary dark:text-primary-fixed font-bold">
                      {config.blur}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={config.blur}
                    onChange={(e) => setConfig(prev => ({ ...prev, blur: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* 7. Blend Mode */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface dark:text-gray-200">
                    CSS Blend Mode
                  </label>
                  <select
                    value={config.blendMode}
                    onChange={(e) => setConfig(prev => ({ ...prev, blendMode: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-border-subtle dark:border-dark-border bg-surface-container-lowest dark:bg-dark-card text-on-surface dark:text-white outline-none"
                  >
                    <option value="normal">Normal (Realistic 3D Paper Emboss)</option>
                    <option value="soft-light">Soft Light (Subtle Ambient Merge)</option>
                    <option value="overlay">Overlay (High Contrast Vibrant)</option>
                    <option value="luminosity">Luminosity (Luxury Metallic Tone)</option>
                    <option value="multiply">Multiply (Deep Shadow Blend)</option>
                    <option value="screen">Screen (Illuminated Hologram)</option>
                  </select>
                </div>

                {/* 8. Invert / Dark Luxury Mode */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold text-on-surface dark:text-gray-200">
                    Invert Tone (Dark Hologram)
                  </span>
                  <input
                    type="checkbox"
                    checked={config.inverted}
                    onChange={(e) => setConfig(prev => ({ ...prev, inverted: e.target.checked }))}
                    className="h-4 w-4 text-primary rounded cursor-pointer accent-primary"
                  />
                </div>

              </div>
            )}

          </div>

          {/* Footer Bar with Dark Mode Quick Toggle */}
          <div className="px-5 py-3 border-t border-border-subtle dark:border-dark-border bg-surface-container-low/50 dark:bg-dark-card/40 flex items-center justify-between text-[11px]">
            <span className="text-on-surface-variant dark:text-gray-400">
              Live Preview Active
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container dark:bg-gray-800 text-on-surface dark:text-gray-200 hover:text-primary transition-colors"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{darkMode ? 'Test in Light' : 'Test in Dark'}</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
}
