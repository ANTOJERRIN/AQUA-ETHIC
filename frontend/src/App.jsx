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

// ===== FIX 1: Base URL Sanitization =====
// Removes trailing slash to prevent double slashes (//api/)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

// ===== FIX 2: Property Key Normalization =====
// Handles both camelCase (pH) and lowercase (ph) keys from ESP32/backend
const getMetricValue = (reading, key, mockValue) => {
    // Try exact key first, then try lowercase version, then fallback to mock
    const value = reading?.[key] ?? reading?.[key.toLowerCase()] ?? mockValue;
    return value;
};

export default function App() {
    // App States
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [currentRoute, setCurrentRoute] = useState('location');
    const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
    const [darkMode, setDarkMode] = useState(false);
    const [reading, setReading] = useState(null);

    // Background Configuration
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

    // Sync Dark Theme
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

    // Initial Loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoadingInitial(false);
        }, 1800);
        return () => clearTimeout(timer);
    }, []);

    // Fetch real data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/sensor-data/latest/AQUA-001`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success' && data.reading) {
                        setReading(data.reading);
                        // Update selected location with real data
                        setSelectedLocation(prev => ({
                            ...prev,
                            metrics: {
                                ph: {
                                    value: getMetricValue(data.reading, 'pH', prev.metrics.ph.value),
                                    unit: prev.metrics.ph.unit,
                                    status: prev.metrics.ph.status
                                },
                                temperature: {
                                    value: getMetricValue(data.reading, 'temperature', prev.metrics.temperature.value),
                                    unit: prev.metrics.temperature.unit,
                                    status: prev.metrics.temperature.status
                                },
                                turbidity: {
                                    value: getMetricValue(data.reading, 'turbidity', prev.metrics.turbidity.value),
                                    unit: prev.metrics.turbidity.unit,
                                    status: prev.metrics.turbidity.status
                                },
                                dissolvedOxygen: {
                                    value: getMetricValue(data.reading, 'dissolvedOxygen', prev.metrics.dissolvedOxygen?.value ?? 0) ?? getMetricValue(data.reading, 'dissolved_oxygen', 0),
                                    unit: 'mg/L',
                                    status: 'safe'
                                }
                            },
                            purityScore: calculatePurity(data.reading),
                            isVerified: data.reading.is_verified || false,
                            txHash: data.reading.blockchain_tx_hash || null
                        }));
                    }
                }
            } catch (error) {
                console.warn('⚠️ Backend not available, using mock data');
                // Fallback to mock data — keep existing selectedLocation
            }
        };

        fetchData();
    }, []);

    // Calculate purity score from real data
    const calculatePurity = (reading) => {
        if (!reading) return 82;
        let score = 100;
        const pH = getMetricValue(reading, 'pH', 7);
        const turbidity = getMetricValue(reading, 'turbidity', 2);
        const dissolvedOxygen = getMetricValue(reading, 'dissolvedOxygen', 6) ?? getMetricValue(reading, 'dissolved_oxygen', 6);

        if (pH < 6.5 || pH > 8.5) score -= 20;
        if (turbidity > 5) score -= 15;
        if (dissolvedOxygen < 5) score -= 15;
        return Math.max(score, 0);
    };

    // Handle URL hash routing
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

            {/* Main Content View Port */}
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