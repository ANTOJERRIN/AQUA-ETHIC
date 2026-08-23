import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Droplets, 
  FlaskConical, 
  Thermometer, 
  Activity, 
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  Layers
} from 'lucide-react';
import { LOCATIONS } from '../data/mockData';

export default function LocationPage({ selectedLocation, setSelectedLocation, setCurrentRoute }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapZoom, setMapZoom] = useState(1);
  const [mapLayer, setMapLayer] = useState('satellite'); // satellite, vector
  const [isLocating, setIsLocating] = useState(false);

  // Filter locations by search
  const filteredLocations = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.stretch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setSearchQuery('');
  };

  const handleGeolocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          // Match closest or default to Ganga Kanpur
          setSelectedLocation(LOCATIONS[0]);
        },
        (err) => {
          setIsLocating(false);
          alert('Location permission not granted. Selected Ganga - Kanpur stretch as default.');
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      alert('Geolocation not supported by browser.');
    }
  };

  return (
    <main className="flex-grow w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-10 flex flex-col md:flex-row gap-gutter">
      
      {/* LEFT PANEL: Interactive Map & Search (60% width on Desktop) */}
      <section className="w-full md:w-3/5 flex flex-col gap-4">
        
        {/* Search & Location Picker Bar */}
        <div className="relative w-full shadow-sm rounded-xl overflow-visible border border-border-subtle dark:border-dark-border bg-surface-container-lowest dark:bg-dark-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all z-20">
          <div className="flex items-center px-4 py-3.5">
            <Search className="w-5 h-5 text-on-surface-variant dark:text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search river stretches, lakes, or districts (e.g. Kanpur, Arkavathi)..."
              className="w-full pl-3 pr-8 bg-transparent border-none outline-none font-medium text-sm md:text-base text-on-surface dark:text-white placeholder:text-gray-400"
            />
            <button
              onClick={handleGeolocation}
              title="Detect My Location"
              disabled={isLocating}
              className="p-2 bg-surface-variant dark:bg-gray-800 rounded-lg hover:bg-outline-variant/50 transition-colors text-on-surface-variant dark:text-gray-200 cursor-pointer shrink-0"
            >
              <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-primary' : ''}`} />
            </button>
          </div>

          {/* Search Autocomplete Dropdown */}
          {searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-surface-container-lowest dark:bg-dark-card border border-border-subtle dark:border-dark-border rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto z-50 animate-pop-in">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    className="p-3.5 px-4 hover:bg-surface-container-low dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-center justify-between border-b border-border-subtle/50 dark:border-dark-border/50 last:border-none"
                  >
                    <div>
                      <p className="font-bold text-sm text-on-surface dark:text-white">
                        {loc.name} — <span className="font-normal text-on-surface-variant dark:text-gray-300">{loc.stretch}</span>
                      </p>
                      <p className="text-xs text-on-surface-variant/80 dark:text-gray-400">{loc.district}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                      loc.status === 'safe'
                        ? 'bg-safe-green/10 text-safe-green'
                        : loc.status === 'caution'
                        ? 'bg-caution-amber/10 text-caution-amber'
                        : 'bg-risk-red/10 text-risk-red'
                    }`}>
                      {loc.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-on-surface-variant dark:text-gray-400">
                  No monitored stretch found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Interactive Dynamic Map Visualizer */}
        <div className="w-full flex-grow min-h-[440px] md:min-h-[540px] bg-slate-900 rounded-2xl border border-border-subtle dark:border-dark-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative overflow-hidden group select-none">
          
          {/* SVG Map Canvas with River Geometry & Satellite Tiles */}
          <div 
            className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out"
            style={{ transform: `scale(${mapZoom})` }}
          >
            {/* Satellite Grid Texture */}
            <div className="absolute inset-0 bg-[#0B132B] opacity-95">
              <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2E7CD6" strokeWidth="0.5" strokeOpacity="0.4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Topographical Contour lines & River Path Vector */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C9FF" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#005CAC" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#002244" stopOpacity="0.9" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Landscape Contours */}
              <path d="M0,200 Q200,100 400,220 T800,180" fill="none" stroke="#1C2D4A" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M0,350 Q300,400 500,280 T800,420" fill="none" stroke="#1C2D4A" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M0,480 Q250,520 600,450 T800,500" fill="none" stroke="#1C2D4A" strokeWidth="1" strokeDasharray="4 4" />

              {/* Flowing Water Body Stream */}
              <path
                d="M -50,150 C 150,180 220,380 400,320 C 580,260 620,480 850,450"
                fill="none"
                stroke="url(#riverGradient)"
                strokeWidth="28"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              <path
                d="M -50,150 C 150,180 220,380 400,320 C 580,260 620,480 850,450"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="16 24"
                className="animate-pulse"
              />

              {/* Tributary branch */}
              <path
                d="M 280,0 C 300,150 360,250 400,320"
                fill="none"
                stroke="url(#riverGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Water Monitoring Station Points */}
              {LOCATIONS.map((loc, idx) => {
                const positions = [
                  { cx: 400, cy: 320 }, // Ganga Kanpur (Center)
                  { cx: 240, cy: 220 }, // Arkavathi
                  { cx: 580, cy: 340 }, // Colorado
                  { cx: 680, cy: 460 }, // Mississippi
                  { cx: 160, cy: 170 }  // Thames
                ];
                const pos = positions[idx % positions.length];
                const isCurrent = selectedLocation.id === loc.id;

                return (
                  <g 
                    key={loc.id} 
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedLocation(loc)}
                  >
                    {isCurrent && (
                      <circle
                        cx={pos.cx}
                        cy={pos.cy}
                        r="32"
                        fill={loc.status === 'safe' ? '#28A745' : loc.status === 'caution' ? '#F59E0B' : '#DC3545'}
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={pos.cx}
                      cy={pos.cy}
                      r={isCurrent ? '14' : '8'}
                      fill={isCurrent ? '#ffffff' : '#94A3B8'}
                      stroke={loc.status === 'safe' ? '#28A745' : loc.status === 'caution' ? '#F59E0B' : '#DC3545'}
                      strokeWidth={isCurrent ? '4' : '2'}
                      className="shadow-lg"
                    />
                    <text
                      x={pos.cx}
                      y={pos.cy - 18}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      className="drop-shadow-md select-none"
                    >
                      {loc.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Floating Location Banner on Top-Left of Map */}
          <div className="absolute top-4 left-4 glass-card dark:bg-dark-card/90 rounded-xl px-4 py-2.5 flex items-center gap-3 border border-white/20 dark:border-dark-border z-10">
            <div className={`w-3 h-3 rounded-full ${
              selectedLocation.status === 'safe'
                ? 'bg-safe-green ring-4 ring-safe-green/20'
                : selectedLocation.status === 'caution'
                ? 'bg-caution-amber ring-4 ring-caution-amber/20'
                : 'bg-risk-red ring-4 ring-risk-red/20'
            }`} />
            <div>
              <p className="text-xs font-bold text-on-surface dark:text-white">
                {selectedLocation.name} ({selectedLocation.stretch})
              </p>
              <p className="text-[10px] text-on-surface-variant dark:text-gray-400">
                Coords: {selectedLocation.coordinates[0]}°N, {selectedLocation.coordinates[1]}°E
              </p>
            </div>
          </div>

          {/* Floating Zoom & Layer Controls on Bottom-Right of Map */}
          <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-10">
            <button
              onClick={() => setMapZoom((prev) => Math.min(prev + 0.25, 2.0))}
              className="w-10 h-10 bg-surface-container-lowest dark:bg-dark-card rounded-xl shadow-md border border-border-subtle dark:border-dark-border flex items-center justify-center text-on-surface dark:text-white hover:bg-surface-variant dark:hover:bg-gray-800 transition-colors"
              title="Zoom In"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMapZoom((prev) => Math.max(prev - 0.25, 0.75))}
              className="w-10 h-10 bg-surface-container-lowest dark:bg-dark-card rounded-xl shadow-md border border-border-subtle dark:border-dark-border flex items-center justify-center text-on-surface dark:text-white hover:bg-surface-variant dark:hover:bg-gray-800 transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Monitored Stretch Pills below map */}
          <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 z-10">
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
              Quick Pick:
            </span>
            {LOCATIONS.slice(0, 3).map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all backdrop-blur-md ${
                  selectedLocation.id === loc.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* RIGHT PANEL: Data Details & Live Assessment (40% width on Desktop) */}
      <aside className="w-full md:w-2/5 flex flex-col">
        <div className="glass-card dark:bg-dark-surface rounded-2xl p-6 md:p-7 border border-border-subtle dark:border-dark-border shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-full flex flex-col gap-6 relative overflow-hidden transition-colors">
          
          {/* Subtle Ambient Background Accent */}
          <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 ${
            selectedLocation.status === 'safe'
              ? 'bg-safe-green/10'
              : selectedLocation.status === 'caution'
              ? 'bg-caution-amber/10'
              : 'bg-risk-red/10'
          }`} />

          {/* Header Info */}
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-2xl md:text-3xl text-on-surface dark:text-white tracking-tight">
                  {selectedLocation.name}
                </h2>
                <p className="font-medium text-base text-on-surface-variant dark:text-gray-300 mt-0.5">
                  {selectedLocation.stretch}
                </p>
              </div>
              <button 
                onClick={() => alert(`Shareable link copied for ${selectedLocation.name}`)}
                title="Share Location" 
                className="p-2.5 rounded-full border border-border-subtle dark:border-dark-border hover:bg-surface-variant dark:hover:bg-dark-card text-on-surface-variant dark:text-gray-300 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 text-on-surface-variant/80 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {selectedLocation.district}
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant mx-1" />
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-secondary" />
                Scanned {selectedLocation.lastScanned}
              </span>
            </div>
          </div>

          <hr className="border-border-subtle dark:border-dark-border" />

          {/* Live Assessment Status Chips */}
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-on-surface dark:text-white">
                Live Assessment Status
              </h3>
              <span className="text-xs text-secondary dark:text-gray-400">
                Purity Score: <b>{selectedLocation.purityScore}/100</b>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Safe Chip */}
              <div
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                  selectedLocation.status === 'safe'
                    ? 'border-2 border-safe-green bg-safe-green/10 shadow-sm scale-105 font-bold text-safe-green'
                    : 'border-border-subtle dark:border-dark-border opacity-40 grayscale'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-safe-green/20 flex items-center justify-center mb-1.5">
                  <CheckCircle2 className="w-5 h-5 text-safe-green" />
                </div>
                <span className="text-xs font-bold">Safe</span>
              </div>

              {/* Caution Chip */}
              <div
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                  selectedLocation.status === 'caution'
                    ? 'border-2 border-caution-amber bg-caution-amber/10 shadow-sm scale-105 font-bold text-caution-amber'
                    : 'border-border-subtle dark:border-dark-border opacity-40 grayscale'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-caution-amber/20 flex items-center justify-center mb-1.5">
                  <AlertTriangle className="w-5 h-5 text-caution-amber" />
                </div>
                <span className="text-xs font-bold">Caution</span>
              </div>

              {/* Risk Chip */}
              <div
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                  selectedLocation.status === 'risk'
                    ? 'border-2 border-risk-red bg-risk-red/10 shadow-sm scale-105 font-bold text-risk-red'
                    : 'border-border-subtle dark:border-dark-border opacity-40 grayscale'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-risk-red/20 flex items-center justify-center mb-1.5">
                  <AlertOctagon className="w-5 h-5 text-risk-red" />
                </div>
                <span className="text-xs font-bold">Risk</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Bento Grid */}
          <div className="grid grid-cols-2 gap-3.5 relative z-10">
            {/* Turbidity */}
            <div className="bg-surface-container-low dark:bg-dark-card p-4 rounded-xl border border-border-subtle dark:border-dark-border">
              <div className="flex items-center gap-2 mb-1.5 text-on-surface-variant dark:text-gray-300">
                <Droplets className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold">Turbidity</span>
              </div>
              <div className="text-xl font-bold text-on-surface dark:text-white flex items-baseline gap-1">
                {selectedLocation.metrics.turbidity.value}{' '}
                <span className="text-xs font-normal text-on-surface-variant dark:text-gray-400">NTU</span>
              </div>
              <div className="w-full bg-outline-variant/30 dark:bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    selectedLocation.metrics.turbidity.status === 'safe' 
                      ? 'bg-safe-green' 
                      : selectedLocation.metrics.turbidity.status === 'caution' 
                      ? 'bg-caution-amber' 
                      : 'bg-risk-red'
                  }`} 
                  style={{ width: `${Math.min((selectedLocation.metrics.turbidity.value / 80) * 100, 100)}%` }} 
                />
              </div>
            </div>

            {/* pH Level */}
            <div className="bg-surface-container-low dark:bg-dark-card p-4 rounded-xl border border-border-subtle dark:border-dark-border">
              <div className="flex items-center gap-2 mb-1.5 text-on-surface-variant dark:text-gray-300">
                <FlaskConical className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold">pH Level</span>
              </div>
              <div className="text-xl font-bold text-on-surface dark:text-white flex items-baseline gap-1">
                {selectedLocation.metrics.ph.value}{' '}
                <span className="text-xs font-normal text-safe-green ml-1 font-semibold">
                  {selectedLocation.metrics.ph.value >= 6.5 && selectedLocation.metrics.ph.value <= 8.5 ? 'Optimal' : 'Skewed'}
                </span>
              </div>
              <div className="w-full bg-outline-variant/30 dark:bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-safe-green h-full w-full rounded-full" />
              </div>
            </div>

            {/* Dissolved Oxygen */}
            <div className="bg-surface-container-low dark:bg-dark-card p-4 rounded-xl border border-border-subtle dark:border-dark-border">
              <div className="flex items-center gap-2 mb-1.5 text-on-surface-variant dark:text-gray-300">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold">Dissolved Oxygen</span>
              </div>
              <div className="text-xl font-bold text-on-surface dark:text-white flex items-baseline gap-1">
                {selectedLocation.metrics.dissolvedOxygen.value}{' '}
                <span className="text-xs font-normal text-on-surface-variant dark:text-gray-400">mg/L</span>
              </div>
              <div className="w-full bg-outline-variant/30 dark:bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${selectedLocation.metrics.dissolvedOxygen.value > 5 ? 'bg-safe-green' : 'bg-risk-red'}`} 
                  style={{ width: `${Math.min((selectedLocation.metrics.dissolvedOxygen.value / 10) * 100, 100)}%` }} 
                />
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-surface-container-low dark:bg-dark-card p-4 rounded-xl border border-border-subtle dark:border-dark-border">
              <div className="flex items-center gap-2 mb-1.5 text-on-surface-variant dark:text-gray-300">
                <Thermometer className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold">Water Temp</span>
              </div>
              <div className="text-xl font-bold text-on-surface dark:text-white flex items-baseline gap-1">
                {selectedLocation.metrics.temperature.value}{' '}
                <span className="text-xs font-normal text-on-surface-variant dark:text-gray-400">°C</span>
              </div>
              <div className="w-full bg-outline-variant/30 dark:bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-primary h-full w-[70%] rounded-full" />
              </div>
            </div>
          </div>

          {/* Primary Action Button to navigate to Purity Report */}
          <div className="mt-auto pt-4 relative z-10">
            <button
              onClick={() => setCurrentRoute('purity')}
              className="w-full py-3.5 bg-primary text-on-primary font-bold text-base rounded-xl shadow-md hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              View Detailed Purity Report
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </aside>
    </main>
  );
}
