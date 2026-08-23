import React, { useState } from 'react';
import { 
  User, 
  History, 
  SlidersHorizontal, 
  Sliders, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ChevronRight, 
  Bell, 
  Moon, 
  Share2, 
  Database,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { USER_PROFILE, LOCATIONS } from '../data/mockData';

export default function AccountPage({ 
  onLogout, 
  setSelectedLocation, 
  setCurrentRoute,
  darkMode,
  setDarkMode
}) {
  const [pushNotifications, setPushNotifications] = useState(USER_PROFILE.preferences.pushNotifications);
  const [dataSharing, setDataSharing] = useState(USER_PROFILE.preferences.dataSharing);

  const handleHistoryClick = (item) => {
    const matchedLocation = LOCATIONS.find((l) => l.id === item.locationId) || LOCATIONS[0];
    setSelectedLocation(matchedLocation);
    setCurrentRoute('purity');
  };

  return (
    <main className="flex-grow max-w-container-max-width mx-auto w-full px-margin-mobile md:px-margin-desktop py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
      
      {/* LEFT COLUMN: Hydrologist Profile Card (Desktop ~35%) */}
      <aside className="col-span-1 md:col-span-4 flex flex-col gap-6">
        <div className="glass-card dark:bg-dark-surface rounded-2xl p-6 md:p-8 flex flex-col items-center text-center border border-border-subtle dark:border-dark-border shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          
          {/* Avatar Container */}
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-surface-container-lowest dark:border-dark-card shadow-md mb-4 relative group">
            <img
              src={USER_PROFILE.avatarUrl}
              alt="Hydrologist Portrait"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <h2 className="font-bold text-2xl text-on-surface dark:text-white tracking-tight">
            {USER_PROFILE.name}
          </h2>
          <p className="text-sm font-medium text-primary dark:text-primary-fixed mb-6">
            {USER_PROFILE.role}
          </p>

          {/* Key Profile Details */}
          <div className="w-full space-y-3.5 text-left pt-2 border-t border-border-subtle dark:border-dark-border">
            <div className="flex justify-between items-center py-1.5 border-b border-border-subtle/50 dark:border-dark-border/50">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-secondary" /> Organization
              </span>
              <span className="text-sm font-semibold text-on-surface dark:text-gray-200">
                {USER_PROFILE.organization}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-border-subtle/50 dark:border-dark-border/50">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-secondary" /> Member Since
              </span>
              <span className="text-sm font-semibold text-on-surface dark:text-gray-200">
                {USER_PROFILE.memberSince}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-secondary" /> Monitored Basins
              </span>
              <span className="text-sm font-semibold text-primary dark:text-primary-fixed">
                5 Active Rivers
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="mt-8 w-full bg-surface-container-high dark:bg-dark-card hover:bg-surface-variant dark:hover:bg-gray-800 text-on-surface dark:text-gray-200 font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-outline-variant/40 dark:border-dark-border cursor-pointer active:scale-98 shadow-xs"
          >
            <LogOut className="w-4 h-4 text-risk-red" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* RIGHT COLUMN: Monitoring History & Preferences (Desktop ~65%) */}
      <div className="col-span-1 md:col-span-8 flex flex-col gap-6">
        
        {/* Monitoring History Section */}
        <section className="glass-card dark:bg-dark-surface rounded-2xl overflow-hidden flex flex-col border border-border-subtle dark:border-dark-border shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="p-5 md:p-6 border-b border-border-subtle dark:border-dark-border bg-surface-container-lowest/60 dark:bg-dark-card/50 flex justify-between items-center">
            <h3 className="font-bold text-base md:text-lg text-on-surface dark:text-white flex items-center gap-2.5">
              <History className="w-5 h-5 text-primary dark:text-primary-fixed" />
              Monitoring History
            </h3>
            <span className="text-xs text-on-surface-variant dark:text-gray-400">
              Click a stretch to open live telemetry
            </span>
          </div>

          {/* History Item Rows */}
          <div className="flex flex-col divide-y divide-border-subtle/60 dark:divide-dark-border/60">
            {USER_PROFILE.history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleHistoryClick(item)}
                className="p-4 px-6 hover:bg-surface-container-low dark:hover:bg-dark-card/80 transition-all flex justify-between items-center cursor-pointer group"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-sm md:text-base text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed transition-colors">
                    {item.title}
                  </span>
                  <span className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                    {item.timestamp} • Score: <b>{item.score}/100</b>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      item.status === 'Safe'
                        ? 'bg-safe-green/10 text-safe-green border border-safe-green/20'
                        : item.status === 'Elevated'
                        ? 'bg-caution-amber/10 text-caution-amber border border-caution-amber/20'
                        : 'bg-risk-red/10 text-risk-red border border-risk-red/20'
                    }`}
                  >
                    {item.status === 'Safe' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    {item.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-outline dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-surface-container-lowest dark:bg-dark-card/30 border-t border-border-subtle dark:border-dark-border text-center">
            <button 
              onClick={() => alert("All 5 monitoring streams synced with Sentinel-2 MSI satellite.")}
              className="text-xs font-bold text-primary dark:text-primary-fixed hover:underline uppercase tracking-wider"
            >
              View Full Audit Log
            </button>
          </div>
        </section>

        {/* Preferences & Settings Section */}
        <section className="glass-card dark:bg-dark-surface rounded-2xl overflow-hidden flex flex-col border border-border-subtle dark:border-dark-border shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="p-5 md:p-6 border-b border-border-subtle dark:border-dark-border bg-surface-container-lowest/60 dark:bg-dark-card/50">
            <h3 className="font-bold text-base md:text-lg text-on-surface dark:text-white flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-primary dark:text-primary-fixed" />
              Platform Preferences
            </h3>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Push Notifications Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-bold text-sm text-on-surface dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" /> Push Notifications & Anomaly Triggers
                </span>
                <span className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                  Receive instant alerts whenever a monitored stretch exceeds hazard thresholds.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-variant dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            {/* Dark Theme Toggle */}
            <div className="flex justify-between items-center pt-4 border-t border-border-subtle/60 dark:border-dark-border/60">
              <div className="flex flex-col">
                <span className="font-bold text-sm text-on-surface dark:text-white flex items-center gap-2">
                  <Moon className="w-4 h-4 text-amber-500" /> Deep Sea Dark Theme
                </span>
                <span className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                  Optimized contrast palette for night-time station operations.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-variant dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            {/* Anonymous Data Sharing */}
            <div className="flex justify-between items-center pt-4 border-t border-border-subtle/60 dark:border-dark-border/60">
              <div className="flex flex-col">
                <span className="font-bold text-sm text-on-surface dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-safe-green" /> Open Research Data Federation
                </span>
                <span className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                  Contribute cryptographically verified hydrological readings to global research.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataSharing}
                  onChange={(e) => setDataSharing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-variant dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

          </div>
        </section>

      </div>

    </main>
  );
}
