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

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const getReadingValue = (reading, key, fallbackValue) =>
  reading?.[key] ?? reading?.[key.toLowerCase()] ?? fallbackValue;

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
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentRoute, setCurrentRoute] = useState('location');
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [darkMode, setDarkMode] = useState(false);
  const [latestBuoyReadings, setLatestBuoyReadings] = useState({});

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingInitial(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

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
    const targetDeviceId = selectedLocation.deviceId || selectedLocation.id;

    const syncLatestReading = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/sensor-data/latest/${encodeURIComponent(targetDeviceId)}`,
          { signal: controller.signal }
        );

        if (!response.ok) return;

        const payload = await response.json();
        if (!isMounted || !payload?.reading) return;

        setLatestBuoyReadings((prev) => ({
          ...prev,
          [selectedLocation.id]: payload.reading,
          [targetDeviceId]: payload.reading
        }));
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Buoy API unavailable, continuing with mock data fallback.');
        }
      }
    };

    syncLatestReading();
    const interval = setInterval(syncLatestReading, 15000); // 15s refresh for live feel

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [selectedLocation?.id, selectedLocation?.deviceId]);

  const selectedLocationWithLiveData = useMemo(() => {
    const targetDeviceId = selectedLocation.deviceId || selectedLocation.id;
    const reading = latestBuoyReadings[selectedLocation.id] || latestBuoyReadings[targetDeviceId];
    if (!reading) return selectedLocation;

    const phVal = Number(getReadingValue(reading, 'pH', selectedLocation.metrics.ph.value));
    const tempVal = Number(getReadingValue(reading, 'temperature', selectedLocation.metrics.temperature.value));
    const turbVal = Number(getReadingValue(reading, 'turbidity', selectedLocation.metrics.turbidity.value));
    const doVal = Number(getReadingValue(
      { ...reading, dissolvedOxygen: reading?.dissolvedOxygen ?? reading?.dissolved_oxygen },
      'dissolvedOxygen',
      selectedLocation.metrics.dissolvedOxygen.value
    ));

    // Dynamic purity calculation for live buoy
    let liveScore = selectedLocation.purityScore;
    if (selectedLocation.isLive) {
      liveScore = 100;
      if (phVal < 6.5 || phVal > 8.5) liveScore -= 20;
      if (turbVal > 10) liveScore -= 20;
      else if (turbVal > 5) liveScore -= 10;
      if (doVal < 5) liveScore -= 20;
      liveScore = Math.max(20, Math.min(100, liveScore));
    }

    return {
      ...selectedLocation,
      purityScore: liveScore,
      lastScanned: formatLastScanned(reading.timestamp),
      metrics: {
        ...selectedLocation.metrics,
        ph: {
          ...selectedLocation.metrics.ph,
          value: phVal
        },
        temperature: {
          ...selectedLocation.metrics.temperature,
          value: tempVal
        },
        turbidity: {
          ...selectedLocation.metrics.turbidity,
          value: turbVal,
          status: turbVal <= 5 ? 'safe' : turbVal <= 25 ? 'caution' : 'risk'
        },
        dissolvedOxygen: {
          ...selectedLocation.metrics.dissolvedOxygen,
          value: doVal,
          status: doVal >= 5 ? 'safe' : 'risk'
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

  if (isLoadingInitial) {
    return <LoadingScreen onLoaded={() => setIsLoadingInitial(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <RiverBackdrop config={backdropConfig} darkMode={darkMode} />
        <LoginPage onLoginSuccess={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-surface-bg/85 dark:bg-dark-bg/90 text-on-surface dark:text-gray-100 transition-colors duration-300">
      <RiverBackdrop config={backdropConfig} darkMode={darkMode} />

      <Header
        currentRoute={currentRoute}
        setCurrentRoute={handleNavigate}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

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

      <Footer setCurrentRoute={handleNavigate} />
    </div>
  );
}
