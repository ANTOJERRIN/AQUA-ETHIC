import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import LocationPage from './pages/LocationPage';
import PurityPage from './pages/PurityPage';
import AccountPage from './pages/AccountPage';
import RiverBackdrop from './components/RiverBackdrop';
import { LOCATIONS } from './data/mockData';

export default function App() {
  // App States
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default logged in for seamless demo review
  const [currentRoute, setCurrentRoute] = useState('location'); // 'location', 'purity', 'account'
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]); // default: Ganga Kanpur
  const [darkMode, setDarkMode] = useState(false);

  // Background Configuration (Porsche Luxury Look)
  const [backdropConfig] = useState({
    imageSrc: '/Gemini_Generated_Image_bi1jc5bi1jc5bi1j.jpg',
    fitMode: 'ambient-hero',
    opacity: 22,
    blur: 0,
    scale: 100,
    blendMode: 'normal',
    glowIntensity: 45,
    inverted: false,
    showNoise: true,
  });

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
    return (
      <div className="relative min-h-screen">
        <RiverBackdrop config={backdropConfig} darkMode={darkMode} />
        <LoginPage onLoginSuccess={handleLogin} />
      </div>
    );
  }

  // 3. Authenticated Web Application Layout
  return (
    <div className="min-h-screen relative flex flex-col bg-surface-bg/85 dark:bg-dark-bg/90 text-on-surface dark:text-gray-100 transition-colors duration-300">
      
      {/* Porsche Luxury Ambient Background Image Layer */}
      <RiverBackdrop config={backdropConfig} darkMode={darkMode} />

      {/* Top Navigation Bar */}
      <Header
        currentRoute={currentRoute}
        setCurrentRoute={handleNavigate}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content View Port (with Top Spacing for Fixed Header) */}
      <div className="flex-grow pt-20 flex flex-col relative z-10">
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


