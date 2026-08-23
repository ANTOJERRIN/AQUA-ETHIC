import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import LocationPage from './pages/LocationPage';
import PurityPage from './pages/PurityPage';
import AccountPage from './pages/AccountPage';
import { LOCATIONS } from './data/mockData';

export default function App() {
  // App States
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default logged in for seamless demo review
  const [currentRoute, setCurrentRoute] = useState('location'); // 'location', 'purity', 'account'
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]); // default: Ganga Kanpur
  const [darkMode, setDarkMode] = useState(false);

  // Sync Dark Theme class to HTML root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  // Initial Loading Screen Pop-In (2 seconds on fresh load)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingInitial(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Handle URL hash routing if present
  useEffect(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (['location', 'purity', 'account'].includes(hash)) {
      setCurrentRoute(hash);
    }
  }, []);

  const handleNavigate = (route) => {
    setCurrentRoute(route);
    window.location.hash = `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentRoute('location');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // 1. Initial Loading Screen
  if (isLoadingInitial) {
    return <LoadingScreen onLoaded={() => setIsLoadingInitial(false)} />;
  }

  // 2. Unauthenticated Login Screen
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  // 3. Authenticated Web Application Layout
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg dark:bg-dark-bg text-on-surface dark:text-gray-100 transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <Header
        currentRoute={currentRoute}
        setCurrentRoute={handleNavigate}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content View Port (with Top Spacing for Fixed Header) */}
      <div className="flex-grow pt-20 flex flex-col">
        {currentRoute === 'location' && (
          <LocationPage
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setCurrentRoute={handleNavigate}
          />
        )}

        {currentRoute === 'purity' && (
          <PurityPage
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        )}

        {currentRoute === 'account' && (
          <AccountPage
            onLogout={handleLogout}
            setSelectedLocation={setSelectedLocation}
            setCurrentRoute={handleNavigate}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}
      </div>

      {/* Footer */}
      <Footer setCurrentRoute={handleNavigate} />

    </div>
  );
}
