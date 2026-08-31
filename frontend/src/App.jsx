import React, { useState, useEffect, useMemo } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import LocationPage from './pages/LocationPage';
import PurityPage from './pages/PurityPage';
import AccountPage from './pages/AccountPage';
import RiverBackdrop from './components/RiverBackdrop';
import { LOCATIONS } from './data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getMetricValue = (value, fallbackValue) =>
  value === undefined || value === null ? fallbackValue : value;

const formatLastScanned = (timestamp) => {
  if (!timestamp) return 'just now';
  const time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) return 'just now';

  const minutes = Math.max(0, Math.round((Date.now() - time) / 60000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} mins ago`;

  const hours = Math.round(minutes / 60);
  return `${hours} hr${hours > 1 ? 's' : ''} ago`;
};

export default function App() {
  // App States
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default logged in for seamless demo review
  const [currentRoute, setCurrentRoute] = useState('location'); // 'location', 'purity', 'account'
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]); // default: Ganga Kanpur
  const [darkMode, setDarkMode] = useState(false);
  const [latestBuoyReadings, setLatestBuoyReadings] = useState({});

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

  useEffect(() => {
    if (!selectedLocation?.id) return;

    const controller = new AbortController();
    let isMounted = true;

    const syncLatestReading = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/sensor-data/latest/${encodeURIComponent(selectedLocation.id)}`,
          { signal: controller.signal }
        );

        if (!response.ok) return;

        const payload = await response.json();
        if (!isMounted || !payload?.reading) return;

        setLatestBuoyReadings((prev) => ({
          ...prev,
          [selectedLocation.id]: payload.reading
        }));
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Buoy API unavailable, continuing with mock data fallback.');
        }
      }
    };

    syncLatestReading();
    const interval = setInterval(syncLatestReading, 30000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [selectedLocation?.id]);

  const selectedLocationWithLiveData = useMemo(() => {
    const reading = latestBuoyReadings[selectedLocation.id];
    if (!reading) return selectedLocation;

    return {
      ...selectedLocation,
      lastScanned: formatLastScanned(reading.timestamp),
      metrics: {
        ...selectedLocation.metrics,
        ph: {
          ...selectedLocation.metrics.ph,
          value: getMetricValue(reading.pH, selectedLocation.metrics.ph.value)
        },
        temperature: {
          ...selectedLocation.metrics.temperature,
          value: getMetricValue(reading.temperature, selectedLocation.metrics.temperature.value)
        },
        turbidity: {
          ...selectedLocation.metrics.turbidity,
          value: getMetricValue(reading.turbidity, selectedLocation.metrics.turbidity.value)
        },
        dissolvedOxygen: {
          ...selectedLocation.metrics.dissolvedOxygen,
          value: getMetricValue(
            reading.dissolvedOxygen ?? reading.dissolved_oxygen,
            selectedLocation.metrics.dissolvedOxygen.value
          )
        }
      }
    };
  }, [latestBuoyReadings, selectedLocation]);

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
            selectedLocation={selectedLocationWithLiveData}
            setSelectedLocation={setSelectedLocation}
            setCurrentRoute={handleNavigate}
          />
        )}

        {currentRoute === 'purity' && (
          <PurityPage
            selectedLocation={selectedLocationWithLiveData}
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

