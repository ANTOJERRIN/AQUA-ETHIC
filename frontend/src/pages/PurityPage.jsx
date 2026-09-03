import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Radio, 
  Satellite, 
  Activity, 
  Droplets, 
  FlaskConical, 
  Thermometer, 
  Zap, 
  ShieldCheck, 
  MoreVertical,
  ArrowUpRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { getTimeSeriesData } from '../data/mockData';
import { getIoTData, getIoTHistory } from '../services/api';

export default function PurityPage({ selectedLocation, setSelectedLocation }) {
  const [dataSource, setDataSource] = useState('remote'); // 'remote' or 'iot'
  const [timeRange, setTimeRange] = useState('24h'); // '24h', '7d', '30d'
  const [activeMetric, setActiveMetric] = useState('ndti');
  const [iotData, setIotData] = useState(null);
  const [iotHistory, setIotHistory] = useState([]);
  const [iotLoading, setIotLoading] = useState(false);
  const [iotError, setIotError] = useState(null);

  // ===== CHECK IF THIS IS A LIVE BUOY LOCATION =====
  const isLiveLocation = selectedLocation?.isLive || false;

  // ===== FORCE IoT MODE FOR LIVE BUOY =====
  useEffect(() => {
    if (isLiveLocation) {
      setDataSource('iot');
    }
  }, [isLiveLocation]);

  // Fetch IoT data when toggle is switched to 'iot' OR when it's a live location
  useEffect(() => {
    if (dataSource === 'iot' || isLiveLocation) {
      fetchIoTData();
      const interval = setInterval(fetchIoTData, 15000); // 15s live refresh
      return () => clearInterval(interval);
    }
  }, [dataSource, timeRange, isLiveLocation, selectedLocation?.id, selectedLocation?.deviceId]);

  const fetchIoTData = async () => {
    setIotLoading(true);
    setIotError(null);
    const targetDevId = selectedLocation?.deviceId || selectedLocation?.id || 'AQUA-001';
    try {
      const [latestRes, historyRes] = await Promise.all([
        getIoTData(targetDevId),
        getIoTHistory(targetDevId, timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30)
      ]);
      
      if (latestRes.status === 'success' && latestRes.reading) {
        setIotData(latestRes.reading);
      }
      if (historyRes.status === 'success' && Array.isArray(historyRes.readings)) {
        // Reverse so historical array flows from oldest to newest
        setIotHistory([...historyRes.readings].reverse());
      }
    } catch (error) {
      setIotError('Failed to fetch IoT data. Make sure the backend is running.');
      console.error('IoT fetch error:', error);
    } finally {
      setIotLoading(false);
    }
  };

  // Get time series data based on source
  const getIoTSeriesData = (history, range) => {
    if (history.length === 0) {
      // Return mock IoT data if no real data
      const mockData = [];
      const points = range === '24h' ? 24 : range === '7d' ? 7 : 30;
      for (let i = points; i >= 0; i--) {
        const time = new Date(Date.now() - i * (range === '24h' ? 3600000 : 86400000));
        mockData.push({
          time: time.toLocaleTimeString(),
          turbidity: 2 + Math.random() * 3,
          ph: 7.0 + Math.random() * 0.6,
          temperature: 26 + Math.random() * 4,
          dissolvedOxygen: 6.0 + Math.random() * 1.5
        });
      }
      return mockData;
    }
    
    return history.map(reading => ({
      time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      turbidity: Number(reading.turbidity ?? reading.turb ?? 0),
      ph: Number(reading.pH ?? reading.ph ?? 7.0),
      temperature: Number(reading.temperature ?? reading.temp ?? 25),
      dissolvedOxygen: Number(reading.dissolved_oxygen ?? reading.dissolvedOxygen ?? 
                       Math.max(0, 14.6 - ((reading.temperature ?? 25) * 0.25)))
    }));
  };

  // ===== USE THE CORRECT DATA SOURCE =====
  const actualDataSource = isLiveLocation ? 'iot' : dataSource;

  // ===== CALCULATE PURITY FROM IoT DATA (MOVED UP) =====
  const calculateIoTPurity = (data) => {
    let score = 100;
    const pH = data.pH ?? data.ph ?? 7;
    const turbidity = data.turbidity ?? data.turb ?? 2;
    const dissolvedOxygen = data.dissolved_oxygen ?? data.dissolvedOxygen ?? 6;

    if (pH < 6.5 || pH > 8.5) score -= 20;
    if (turbidity > 5) score -= 15;
    if (dissolvedOxygen < 5) score -= 15;
    return Math.max(score, 0);
  };

  const timeSeries = actualDataSource === 'remote' 
    ? getTimeSeriesData(selectedLocation.id, timeRange, actualDataSource)
    : getIoTSeriesData(iotHistory, timeRange);

  const score = actualDataSource === 'remote' 
    ? selectedLocation.purityScore 
    : (iotData ? calculateIoTPurity(iotData) : 50);

  // Color calculation for gauge
  const getGaugeColor = (val) => {
    if (val >= 80) return '#28A745';
    if (val >= 60) return '#F59E0B';
    return '#DC3545';
  };

  const gaugeColor = getGaugeColor(score);

  // Get current data for display
  const currentData = actualDataSource === 'remote' ? selectedLocation : iotData;

  return (
    <main className="flex-grow max-w-container-max-width mx-auto w-full px-margin-mobile md:px-margin-desktop py-8 md:py-10 flex flex-col gap-6 md:gap-8">
      
      {/* ===== LIVE BUOY BADGE ===== */}
      {isLiveLocation && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-3 md:p-4 flex items-center gap-3 animate-pulse">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-ping"></span>
          <span className="text-sm font-semibold text-green-400">
            🟢 Live Buoy — Real-time telemetry from ESP32
          </span>
        </div>
      )}

      {/* Header & Circular Purity Gauge Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primary-fixed bg-primary/10 dark:bg-primary-fixed/20 px-3 py-1 rounded-full">
              {actualDataSource === 'remote' 
                ? `Verified Water Ledger ID: #RW-${selectedLocation.id.toUpperCase().slice(0, 8)}`
                : `📍 IoT Buoy: ${iotData?.device_id || 'AQUA-001'}`
              }
            </span>
            {isLiveLocation && (
              <span className="text-xs font-bold uppercase tracking-widest bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                🟢 LIVE
              </span>
            )}
          </div>
          <h1 className="font-bold text-2xl md:text-4xl text-on-surface dark:text-white tracking-tight">
            {actualDataSource === 'remote' 
              ? `${selectedLocation.name} — ${selectedLocation.stretch}`
              : `Live Buoy Data — ${selectedLocation.name || 'AQUA-001'}`
            }
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant dark:text-gray-300 mt-1">
            {actualDataSource === 'remote' 
              ? 'High-precision satellite multispectral imaging and real-time buoy telemetry.'
              : isLiveLocation 
                ? '🟢 Real-time sensor data from the ESP32 buoy in the water.'
                : 'Real-time sensor data from the ESP32 buoy in the water.'
            }
          </p>
        </div>

        {/* Circular Purity Gauge Component */}
        <div className="glass-panel dark:bg-dark-card rounded-2xl p-5 md:p-6 flex items-center gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-border-subtle dark:border-dark-border self-stretch md:self-auto shrink-0">
          <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-container-high dark:text-gray-700 stroke-current"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.2"
              />
              <path
                style={{
                  stroke: gaugeColor,
                  strokeDasharray: `${score}, 100`,
                  transition: 'stroke-dasharray 1s ease-in-out, stroke 0.5s ease'
                }}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-bold text-3xl md:text-4xl" style={{ color: gaugeColor }}>
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold text-secondary dark:text-gray-400 -mt-1">
                / 100
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base md:text-lg text-on-surface dark:text-white">
              Purity Rating
            </h3>
            <p className="text-xs md:text-sm font-bold flex items-center gap-1.5 mt-1" style={{ color: gaugeColor }}>
              {score >= 80 ? (
                <><CheckCircle2 className="w-4 h-4" /> Condition: Optimal & Safe</>
              ) : score >= 60 ? (
                <><AlertTriangle className="w-4 h-4" /> Condition: Caution Required</>
              ) : (
                <><AlertTriangle className="w-4 h-4" /> Condition: Critical Risk</>
              )}
            </p>
            <span className="text-[11px] text-on-surface-variant dark:text-gray-400 block mt-1">
              {actualDataSource === 'remote' 
                ? `Refreshed ${selectedLocation.lastScanned}`
                : iotData ? `Updated: ${new Date(iotData.timestamp).toLocaleString()}` : 'Waiting for data...'
              }
            </span>
          </div>
        </div>
      </section>

      {/* Data Source Badge */}
      <div className="flex justify-end">
        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold backdrop-blur-md ${
          actualDataSource === 'iot' && iotData
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : actualDataSource === 'remote'
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}>
          {iotLoading ? '⏳ Loading...' : actualDataSource === 'remote' ? '🛰️ Remote Sensing' : iotData ? '🟢 Live IoT Data' : '🔴 No IoT Data'}
        </span>
      </div>

      {/* Dynamic Anomaly Warning Banner - Only for Remote Sensing */}
      {actualDataSource === 'remote' && (selectedLocation.anomaly_flag || selectedLocation.status !== 'safe') && (
        <div className={`rounded-2xl p-4 md:p-5 flex items-start gap-4 border transition-all animate-pop-in ${
          selectedLocation.status === 'risk'
            ? 'bg-error-container/60 dark:bg-error-container/30 border-error/30 text-on-error-container dark:text-red-200'
            : 'bg-caution-amber/15 dark:bg-caution-amber/20 border-caution-amber/40 text-amber-950 dark:text-amber-200'
        }`}>
          <div className={`p-2 rounded-xl shrink-0 ${selectedLocation.status === 'risk' ? 'bg-risk-red text-white' : 'bg-caution-amber text-black'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base md:text-lg">
              {selectedLocation.status === 'risk' ? 'Critical Water Quality Anomaly Detected' : 'Turbidity & Sedimentation Alert'}
            </h4>
            <p className="text-xs md:text-sm opacity-90 mt-1 leading-relaxed">
              {selectedLocation.anomalyMessage || 'Spectrometric indices indicate abnormal variance from the historical baseline. Ground buoy sensors have confirmed localized shift.'}
            </p>
          </div>
        </div>
      )}

      {/* Filter & Source Toggle Bar - HIDE FOR LIVE BUOY */}
      {!isLiveLocation && (
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-surface dark:bg-dark-card rounded-2xl p-2.5 shadow-sm border border-border-subtle dark:border-dark-border">
          
          {/* Segmented Data Source Toggle */}
          <div className="flex bg-surface-container-low dark:bg-dark-surface rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setDataSource('remote')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                dataSource === 'remote'
                  ? 'bg-white dark:bg-dark-card text-primary dark:text-primary-fixed shadow-sm'
                  : 'text-on-surface-variant dark:text-gray-400 hover:text-on-surface dark:hover:text-white'
              }`}
            >
              <Satellite className="w-4 h-4" />
              Remote Sensing
            </button>
            <button
              onClick={() => setDataSource('iot')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                dataSource === 'iot'
                  ? 'bg-white dark:bg-dark-card text-primary dark:text-primary-fixed shadow-sm'
                  : 'text-on-surface-variant dark:text-gray-400 hover:text-on-surface dark:hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4" />
              IoT Buoy Sensors
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center justify-end gap-2 pr-2">
            <Calendar className="w-4 h-4 text-on-surface-variant dark:text-gray-400" />
            <div className="flex bg-surface-container-low dark:bg-dark-surface rounded-lg p-1">
              {[
                { id: '24h', label: '24 Hours' },
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' }
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    timeRange === range.id
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-on-surface-variant dark:text-gray-400 hover:text-on-surface dark:hover:text-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* For Live Buoy, show a simple toggle hint */}
      {isLiveLocation && (
        <div className="flex justify-between items-center bg-green-500/5 border border-green-500/20 rounded-2xl p-3 px-5">
          <span className="text-sm text-green-400 font-medium">🟢 Live IoT Data — Auto-refreshing</span>
          <span className="text-xs text-gray-400">Last updated: {iotData ? new Date(iotData.timestamp).toLocaleString() : 'Waiting...'}</span>
        </div>
      )}

      {/* Main Content Split: Left Chart (65%) & Right Metrics (35%) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        
        {/* Left Column: Interactive Time-Series Chart Canvas */}
        <div className="md:col-span-8 glass-card dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border p-6 md:p-7 flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h2 className="font-bold text-lg md:text-xl text-on-surface dark:text-white">
                {actualDataSource === 'remote' ? 'Spectral Indices (NDTI / NDCI)' : 'Continuous Sensor Telemetry'}
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                {actualDataSource === 'remote' ? 'Normalized Difference Turbidity & Chlorophyll Index' : isLiveLocation ? '🟢 Live Buoy Telemetry' : 'Buoy Station Hydro-Chemical Array'}
              </p>
            </div>
            
            {/* Legend Tag */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-primary dark:text-primary-fixed">
                <span className="w-3 h-3 rounded-full bg-primary" />
                {actualDataSource === 'remote' ? 'NDTI (Turbidity)' : 'Turbidity (NTU)'}
              </span>
              <span className="flex items-center gap-1.5 text-safe-green">
                <span className="w-3 h-3 rounded-full bg-safe-green" />
                {actualDataSource === 'remote' ? 'NDCI (Chlorophyll)' : 'pH Level'}
              </span>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="w-full h-72 md:h-80 bg-surface-container-low dark:bg-dark-card rounded-xl relative overflow-hidden p-4 flex flex-col justify-between select-none">
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none opacity-40">
              <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-700" />
              <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-700" />
              <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-700" />
              <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-700" />
            </div>

            {/* Dynamic Curve Graph */}
            <div className="relative w-full h-full flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradientPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#005CAC" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#005CAC" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="areaGradientSecondary" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#28A745" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#28A745" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area Fill for Primary Metric */}
                <path
                  d={`M 0,200 ${timeSeries.map((pt, i) => {
                    const x = (i / (timeSeries.length - 1)) * 600;
                    const val = actualDataSource === 'remote' ? pt.ndti * 350 : (pt.turbidity / 80) * 160;
                    const y = Math.max(20, 180 - val);
                    return `L ${x},${y}`;
                  }).join(' ')} L 600,200 Z`}
                  fill="url(#areaGradientPrimary)"
                />

                {/* Primary Stroke Line */}
                <path
                  d={`M ${timeSeries.map((pt, i) => {
                    const x = (i / (timeSeries.length - 1)) * 600;
                    const val = actualDataSource === 'remote' ? pt.ndti * 350 : (pt.turbidity / 80) * 160;
                    const y = Math.max(20, 180 - val);
                    return `${i === 0 ? '' : 'L'} ${x},${y}`;
                  }).join(' ')}`}
                  fill="none"
                  stroke="#005CAC"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Secondary Stroke Line */}
                <path
                  d={`M ${timeSeries.map((pt, i) => {
                    const x = (i / (timeSeries.length - 1)) * 600;
                    const val = actualDataSource === 'remote' ? pt.ndci * 450 : ((pt.ph - 6) / 3) * 120;
                    const y = Math.max(30, 180 - val);
                    return `${i === 0 ? '' : 'L'} ${x},${y}`;
                  }).join(' ')}`}
                  fill="none"
                  stroke="#28A745"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />

                {/* Interactive Data Point Dots */}
                {timeSeries.map((pt, i) => {
                  const x = (i / (timeSeries.length - 1)) * 600;
                  const val = actualDataSource === 'remote' ? pt.ndti * 350 : (pt.turbidity / 80) * 160;
                  const y = Math.max(20, 180 - val);

                  return (
                    <g key={i} className="group cursor-pointer">
                      <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#005CAC" strokeWidth="3" />
                      <circle cx={x} cy={y} r="12" fill="#005CAC" fillOpacity="0.15" className="hover:scale-150 transition-transform" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-Axis Timestamps */}
            <div className="flex justify-between items-center pt-3 border-t border-border-subtle dark:border-dark-border text-xs font-semibold text-on-surface-variant dark:text-gray-400">
              {timeSeries.map((pt, i) => (
                <span key={i}>{pt.time}</span>
              ))}
            </div>

          </div>

          {/* Footer Metadata */}
          <div className="mt-4 pt-4 border-t border-border-subtle dark:border-dark-border flex flex-wrap justify-between items-center text-xs text-on-surface-variant dark:text-gray-400 gap-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-safe-green" />
              Cryptographic HMAC Verification: <b>{actualDataSource === 'remote' ? 'Passed (Block #4928)' : iotData?.is_verified ? '✅ Verified on Blockchain' : '⏳ Pending'}</b>
            </span>
            <span>
              {actualDataSource === 'remote' 
                ? `Ground Resolution: ${selectedLocation.remoteSensing.resolution}`
                : iotData?.blockchain_tx_hash ? `TX: ${iotData.blockchain_tx_hash.slice(0, 16)}...` : 'No blockchain record'
              }
            </span>
          </div>

        </div>

        {/* Right Column: Sensor Metrics Cards List (35%) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          
          {actualDataSource === 'remote' ? (
            // ===== REMOTE SENSING METRICS =====
            <>
              <div className="glass-card dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border p-4.5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">pH Level</p>
                    <h3 className="font-bold text-2xl md:text-3xl text-on-surface dark:text-white mt-1">{selectedLocation.metrics.ph.value}</h3>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-safe-green ring-4 ring-safe-green/20 mt-1" />
                </div>
                <div className="mt-4 bg-surface-container-low dark:bg-dark-card h-2 rounded-full overflow-hidden">
                  <div className="bg-safe-green h-full w-[78%] rounded-full" />
                </div>
                <div className="flex justify-between items-center text-xs text-on-surface-variant dark:text-gray-400 mt-2">
                  <span>Standard Baseline: 6.5 - 8.5</span>
                  <span className="text-safe-green font-bold">Stable</span>
                </div>
              </div>

              <div className={`glass-card dark:bg-dark-surface rounded-2xl border p-4.5 shadow-sm ${selectedLocation.metrics.turbidity.status === 'safe' ? 'border-border-subtle dark:border-dark-border' : 'border-l-4 border-l-caution-amber border-border-subtle dark:border-dark-border'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Turbidity (NTU)</p>
                    <h3 className="font-bold text-2xl md:text-3xl text-on-surface dark:text-white mt-1">{selectedLocation.metrics.turbidity.value}</h3>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full mt-1 ${selectedLocation.metrics.turbidity.status === 'safe' ? 'bg-safe-green ring-4 ring-safe-green/20' : 'bg-caution-amber ring-4 ring-caution-amber/20'}`} />
                </div>
                <div className="mt-4 bg-surface-container-low dark:bg-dark-card h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${selectedLocation.metrics.turbidity.status === 'safe' ? 'bg-safe-green' : 'bg-caution-amber'}`} style={{ width: `${Math.min((selectedLocation.metrics.turbidity.value / 80) * 100, 100)}%` }} />
                </div>
                <div className="flex justify-between items-center text-xs text-on-surface-variant dark:text-gray-400 mt-2">
                  <span>Threshold: &lt; 25.0 NTU</span>
                  <span className={`font-bold ${selectedLocation.metrics.turbidity.status === 'safe' ? 'text-safe-green' : 'text-caution-amber'}`}>{selectedLocation.metrics.turbidity.trend}</span>
                </div>
              </div>

              <div className="glass-card dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border p-4.5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Dissolved Oxygen</p>
                    <h3 className="font-bold text-2xl md:text-3xl text-on-surface dark:text-white mt-1">{selectedLocation.metrics.dissolvedOxygen.value} <span className="text-xs font-normal text-on-surface-variant dark:text-gray-400">mg/L</span></h3>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-safe-green ring-4 ring-safe-green/20 mt-1" />
                </div>
                <div className="mt-4 bg-surface-container-low dark:bg-dark-card h-2 rounded-full overflow-hidden">
                  <div className="bg-safe-green h-full w-[85%] rounded-full" />
                </div>
                <div className="flex justify-between items-center text-xs text-on-surface-variant dark:text-gray-400 mt-2">
                  <span>Aquatic Safety: &gt; 5.0 mg/L</span>
                  <span className="text-safe-green font-bold">Healthy</span>
                </div>
              </div>

              <div className="glass-card dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border p-4.5 shadow-sm grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Water Temp</p>
                  <h4 className="font-bold text-xl text-on-surface dark:text-white mt-1">{selectedLocation.metrics.temperature.value}°C</h4>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Conductivity</p>
                  <h4 className="font-bold text-xl text-on-surface dark:text-white mt-1">{selectedLocation.metrics.conductivity.value} <span className="text-[10px] text-gray-400 font-normal">µS/cm</span></h4>
                </div>
              </div>
            </>
          ) : (
            // ===== IoT METRICS =====
            <>
              {iotLoading ? (
                <div className="text-center py-8 text-gray-500">⏳ Loading IoT data...</div>
              ) : iotError ? (
                <div className="text-center py-8 text-red-500">❌ {iotError}</div>
              ) : iotData ? (
                <>
                  <div className="glass-card dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border p-4.5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">pH Level</p>
                        <h3 className="font-bold text-2xl md:text-3xl text-on-surface dark:text-white mt-1">{iotData.pH ?? iotData.ph ?? '--'}</h3>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full ${(iotData.pH ?? 7) >= 6.5 && (iotData.pH ?? 7) <= 8.5 ? 'bg-safe-green ring-4 ring-safe-green/20' : 'bg-caution-amber ring-4 ring-caution-amber/20'}`} />
                    </div>
                    <div className="mt-4 bg-surface-container-low dark:bg-dark-card h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${(iotData.pH ?? 7) >= 6.5 && (iotData.pH ?? 7) <= 8.5 ? 'bg-safe-green' : 'bg-caution-amber'}`} style={{ width: `${((iotData.pH ?? 7) / 10) * 100}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-xs text-on-surface-variant dark:text-gray-400 mt-2">
                      <span>Standard Baseline: 6.5 - 8.5</span>
                      <span className={`font-bold ${(iotData.pH ?? 7) >= 6.5 && (iotData.pH ?? 7) <= 8.5 ? 'text-safe-green' : 'text-caution-amber'}`}>
                        {(iotData.pH ?? 7) >= 6.5 && (iotData.pH ?? 7) <= 8.5 ? 'Stable' : 'Skewed'}
                      </span>
                    </div>
                  </div>

                  <div className={`glass-card dark:bg-dark-surface rounded-2xl border p-4.5 shadow-sm ${(iotData.turbidity ?? 0) <= 5 ? 'border-border-subtle dark:border-dark-border' : 'border-l-4 border-l-caution-amber border-border-subtle dark:border-dark-border'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Turbidity (NTU)</p>
                        <h3 className="font-bold text-2xl md:text-3xl text-on-surface dark:text-white mt-1">{iotData.turbidity ?? iotData.turb ?? '--'}</h3>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full ${(iotData.turbidity ?? 0) <= 5 ? 'bg-safe-green ring-4 ring-safe-green/20' : 'bg-caution-amber ring-4 ring-caution-amber/20'}`} />
                    </div>
                    <div className="mt-4 bg-surface-container-low dark:bg-dark-card h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${(iotData.turbidity ?? 0) <= 5 ? 'bg-safe-green' : 'bg-caution-amber'}`} style={{ width: `${Math.min(((iotData.turbidity ?? 0) / 80) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-xs text-on-surface-variant dark:text-gray-400 mt-2">
                      <span>Threshold: &lt; 25.0 NTU</span>
                      <span className={`font-bold ${(iotData.turbidity ?? 0) <= 5 ? 'text-safe-green' : 'text-caution-amber'}`}>
                        {(iotData.turbidity ?? 0) <= 5 ? 'Clear' : 'Elevated'}
                      </span>
                    </div>
                  </div>

                  <div className="glass-card dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border p-4.5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Dissolved Oxygen</p>
                        <h3 className="font-bold text-2xl md:text-3xl text-on-surface dark:text-white mt-1">
                          {iotData.dissolved_oxygen ?? iotData.dissolvedOxygen ?? '--'} 
                          <span className="text-xs font-normal text-on-surface-variant dark:text-gray-400"> mg/L</span>
                        </h3>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full ${(iotData.dissolved_oxygen ?? 6) >= 5 ? 'bg-safe-green ring-4 ring-safe-green/20' : 'bg-risk-red ring-4 ring-risk-red/20'}`} />
                    </div>
                    <div className="mt-4 bg-surface-container-low dark:bg-dark-card h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${(iotData.dissolved_oxygen ?? 6) >= 5 ? 'bg-safe-green' : 'bg-risk-red'}`} style={{ width: `${Math.min(((iotData.dissolved_oxygen ?? 6) / 10) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-xs text-on-surface-variant dark:text-gray-400 mt-2">
                      <span>Aquatic Safety: &gt; 5.0 mg/L</span>
                      <span className={`font-bold ${(iotData.dissolved_oxygen ?? 6) >= 5 ? 'text-safe-green' : 'text-risk-red'}`}>
                        {(iotData.dissolved_oxygen ?? 6) >= 5 ? 'Healthy' : 'Low'}
                      </span>
                    </div>
                  </div>

                  <div className="glass-card dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border p-4.5 shadow-sm grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Water Temp</p>
                      <h4 className="font-bold text-xl text-on-surface dark:text-white mt-1">{iotData.temperature ?? iotData.temp ?? '--'}°C</h4>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Device</p>
                      <h4 className="font-bold text-xl text-on-surface dark:text-white mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                        Online
                      </h4>
                    </div>
                  </div>

                  {iotData.data_hash && (
                    <div className="glass-card dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border p-4.5 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">
                        <ShieldCheck className="w-4 h-4 text-safe-green" />
                        Blockchain Verification
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-sm font-bold ${iotData.is_verified ? 'text-safe-green' : 'text-caution-amber'}`}>
                          {iotData.is_verified ? '✅ Verified' : '⏳ Pending'}
                        </span>
                        {iotData.blockchain_tx_hash && (
                          <span className="text-xs text-on-surface-variant dark:text-gray-400 truncate">
                            TX: {iotData.blockchain_tx_hash.slice(0, 16)}...
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>⚠️ No IoT data available</p>
                  <p className="text-xs mt-2">Make sure the ESP32 is sending data to the backend.</p>
                </div>
              )}
            </>
          )}

        </div>

      </div>

    </main>
  );
}