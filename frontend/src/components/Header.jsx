import React, { useState } from 'react';
import BrandLogo from './BrandLogo';
import { Bell, Moon, Sun, Settings, Menu, X, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Header({ currentRoute, setCurrentRoute, darkMode, setDarkMode, unreadAlerts = 2 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navLinks = [
    { id: 'location', label: 'Location' },
    { id: 'purity', label: 'Purity' },
    { id: 'account', label: 'Account' },
  ];

  return (
    <header className="app-header fixed w-full">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto">
        
        {/* Brand Logo - small static top-left wordmark */}
        <div 
          className="cursor-pointer active:scale-95 transition-transform"
          onClick={() => {
            setCurrentRoute('location');
            setMobileMenuOpen(false);
          }}
        >
          <BrandLogo size="medium" showWordmark={true} />
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="app-header__nav hidden md:flex gap-8 h-full items-center">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentRoute(link.id)}
                className={`h-full flex items-center px-1 text-[17px] tracking-tight transition-all duration-200 relative pb-1.5 ${
                  isActive ? 'active' : ''
                }`}
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Trailing Controls */}
        <div className="flex items-center gap-2 md:gap-3 text-on-surface-variant dark:text-gray-200">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-xl hover:bg-surface-variant dark:hover:bg-dark-card transition-colors active:scale-95 text-on-surface-variant dark:text-gray-200"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-xl hover:bg-surface-variant dark:hover:bg-dark-card transition-colors active:scale-95 relative"
              title="Notifications & Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadAlerts > 0 && (
                <span
                  className="pulse-dot absolute"
                  style={{ top: 6, right: 6, width: 8, height: 8 }}
                />
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 md:w-96 glass-card rounded-2xl shadow-xl border border-border-subtle dark:border-dark-border p-4 z-50 animate-pop-in">
                <div className="flex justify-between items-center pb-3 border-b border-border-subtle dark:border-dark-border">
                  <span className="font-bold text-sm text-on-surface dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" /> Active Sensor Alerts
                  </span>
                  <span className="text-xs bg-primary/10 text-primary dark:bg-primary-fixed/20 dark:text-primary-fixed px-2 py-0.5 rounded-full font-semibold">
                    2 New
                  </span>
                </div>
                <div className="space-y-3 py-3">
                  <div 
                    onClick={() => {
                      setCurrentRoute('purity');
                      setNotificationsOpen(false);
                    }}
                    className="p-3 bg-error-container/40 dark:bg-error-container/20 rounded-xl border border-error/20 cursor-pointer hover:bg-error-container/60 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-risk-red mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-on-error-container dark:text-red-200">
                          Arkavathi Lake — Severe NDTI Anomaly
                        </p>
                        <p className="text-[11px] text-on-error-container/80 dark:text-red-300/80 mt-0.5">
                          High siltation & reduced DO levels detected by Sentinel-2.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => {
                      setCurrentRoute('location');
                      setNotificationsOpen(false);
                    }}
                    className="p-3 bg-caution-amber/10 dark:bg-caution-amber/20 rounded-xl border border-caution-amber/30 cursor-pointer hover:bg-caution-amber/20 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-caution-amber mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          Ganga (Kanpur) — Turbidity Shift
                        </p>
                        <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                          Turbidity rose to 24.5 NTU near the industrial discharge canal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-primary dark:text-primary-fixed hover:underline"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Quick Settings Shortcut */}
          <button
            onClick={() => setCurrentRoute('account')}
            title="Preferences & Profile"
            className="p-2.5 rounded-xl hover:bg-surface-variant dark:hover:bg-dark-card transition-colors active:scale-95 hidden sm:block"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-surface-variant dark:hover:bg-dark-card transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle dark:border-dark-border bg-surface dark:bg-dark-surface px-6 py-4 space-y-2 animate-pop-in">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentRoute(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface dark:text-gray-200 hover:bg-surface-variant dark:hover:bg-dark-card'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
