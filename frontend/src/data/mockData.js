
export const LOCATIONS = [
  {
    id: "ganga-kanpur",
    deviceId: "ganga-kanpur",
    name: "Ganga River",
    stretch: "Kanpur Stretch",
    district: "Uttar Pradesh",
    coordinates: [26.4499, 80.3319],
    purityScore: 82,
    status: "safe",
    lastScanned: "10 mins ago",
    anomaly_flag: false,
    anomalyMessage: "Mild turbidity elevation observed near industrial outlet zone over the last 2 hours.",
    metrics: {
      turbidity: { value: 24.5, unit: "NTU", status: "caution", trend: "+1.2", baseline: 20 },
      ph: { value: 7.8, unit: "pH", status: "safe", trend: "stable", baseline: 7.5 },
      dissolvedOxygen: { value: 6.8, unit: "mg/L", status: "safe", trend: "+0.3", baseline: 6.5 },
      temperature: { value: 24.5, unit: "°C", status: "safe", trend: "-0.5", baseline: 24.0 },
      conductivity: { value: 380, unit: "µS/cm", status: "safe", trend: "stable", baseline: 400 }
    },
    remoteSensing: {
      ndti: 0.18,
      ndci: 0.09,
      turbidityIndex: "Low-Moderate",
      algalBloomRisk: "Low",
      satelliteSource: "Sentinel-2 MSI",
      resolution: "10m Ground Resolution"
    }
  },
  {
    id: "arkavathi-bengaluru",
    deviceId: "arkavathi-bengaluru",
    name: "Arkavathi Lake",
    stretch: "Bengaluru Reservoir Stretch",
    district: "Karnataka",
    coordinates: [12.9716, 77.5946],
    purityScore: 48,
    status: "risk",
    lastScanned: "4 mins ago",
    anomaly_flag: true,
    anomalyMessage: "Critical anomaly detected: Elevated NDTI + Low DO levels indicating severe runoff.",
    metrics: {
      turbidity: { value: 68.4, unit: "NTU", status: "risk", trend: "+14.2", baseline: 25 },
      ph: { value: 6.1, unit: "pH", status: "caution", trend: "-0.8", baseline: 7.2 },
      dissolvedOxygen: { value: 3.4, unit: "mg/L", status: "risk", trend: "-2.1", baseline: 6.0 },
      temperature: { value: 27.8, unit: "°C", status: "caution", trend: "+1.8", baseline: 25.0 },
      conductivity: { value: 890, unit: "µS/cm", status: "risk", trend: "+120", baseline: 500 }
    },
    remoteSensing: {
      ndti: 0.42,
      ndci: 0.28,
      turbidityIndex: "High Siltation",
      algalBloomRisk: "Severe",
      satelliteSource: "Sentinel-2 MSI + Landsat 9",
      resolution: "10m Ground Resolution"
    }
  },
  {
    id: "colorado-alpha",
    deviceId: "colorado-alpha",
    name: "Colorado River",
    stretch: "Station Alpha - Basin 4",
    district: "Utah / Arizona Border",
    coordinates: [36.9928, -111.4975],
    purityScore: 91,
    status: "safe",
    lastScanned: "25 mins ago",
    anomaly_flag: false,
    anomalyMessage: null,
    metrics: {
      turbidity: { value: 12.1, unit: "NTU", status: "safe", trend: "-0.4", baseline: 15 },
      ph: { value: 7.4, unit: "pH", status: "safe", trend: "stable", baseline: 7.4 },
      dissolvedOxygen: { value: 8.1, unit: "mg/L", status: "safe", trend: "+0.1", baseline: 8.0 },
      temperature: { value: 18.2, unit: "°C", status: "safe", trend: "stable", baseline: 18.0 },
      conductivity: { value: 240, unit: "µS/cm", status: "safe", trend: "-10", baseline: 250 }
    },
    remoteSensing: {
      ndti: 0.08,
      ndci: 0.04,
      turbidityIndex: "Pristine",
      algalBloomRisk: "None",
      satelliteSource: "Sentinel-2 MSI",
      resolution: "10m Ground Resolution"
    }
  },
  {
    id: "mississippi-delta",
    deviceId: "mississippi-delta",
    name: "Mississippi River",
    stretch: "Delta Point Sector 9",
    district: "Louisiana Coast",
    coordinates: [29.9511, -90.0715],
    purityScore: 68,
    status: "caution",
    lastScanned: "18 mins ago",
    anomaly_flag: true,
    anomalyMessage: "Moderate agricultural runoff detected along western bank confluence.",
    metrics: {
      turbidity: { value: 45.2, unit: "NTU", status: "caution", trend: "+5.1", baseline: 30 },
      ph: { value: 7.6, unit: "pH", status: "safe", trend: "stable", baseline: 7.5 },
      dissolvedOxygen: { value: 5.2, unit: "mg/L", status: "caution", trend: "-0.9", baseline: 6.5 },
      temperature: { value: 22.4, unit: "°C", status: "safe", trend: "+0.3", baseline: 22.0 },
      conductivity: { value: 510, unit: "µS/cm", status: "caution", trend: "+45", baseline: 450 }
    },
    remoteSensing: {
      ndti: 0.29,
      ndci: 0.16,
      turbidityIndex: "Moderate Silt",
      algalBloomRisk: "Moderate",
      satelliteSource: "Landsat 9",
      resolution: "30m Ground Resolution"
    }
  },
  {
    id: "thames-central",
    deviceId: "thames-central",
    name: "Thames River",
    stretch: "London Central Reach",
    district: "Greater London",
    coordinates: [51.5074, -0.1278],
    purityScore: 86,
    status: "safe",
    lastScanned: "1 hr ago",
    anomaly_flag: false,
    anomalyMessage: null,
    metrics: {
      turbidity: { value: 16.8, unit: "NTU", status: "safe", trend: "-1.1", baseline: 18 },
      ph: { value: 7.5, unit: "pH", status: "safe", trend: "stable", baseline: 7.5 },
      dissolvedOxygen: { value: 7.4, unit: "mg/L", status: "safe", trend: "+0.4", baseline: 7.0 },
      temperature: { value: 16.5, unit: "°C", status: "safe", trend: "-0.2", baseline: 16.5 },
      conductivity: { value: 310, unit: "µS/cm", status: "safe", trend: "stable", baseline: 320 }
    },
    remoteSensing: {
      ndti: 0.12,
      ndci: 0.06,
      turbidityIndex: "Normal",
      algalBloomRisk: "Low",
      satelliteSource: "Sentinel-2 MSI",
      resolution: "10m Ground Resolution"
    }
  },
  // ===== 🟢 LIVE BUOY LOCATION =====
  {
    id: "live-buoy-aqua-001",
    deviceId: "AQUA-001",
    name: "Live Buoy",
    stretch: "AQUA-001 — Real-time Telemetry",
    district: "IoT Monitoring Station",
    coordinates: [26.4499, 80.3319],
    purityScore: 88,
    status: "safe",
    lastScanned: "Live continuous",
    anomaly_flag: false,
    anomalyMessage: null,
    isLive: true,
    metrics: {
      ph: { value: 7.4, unit: "pH", status: "safe", trend: "live", baseline: 7.4 },
      temperature: { value: 24.5, unit: "°C", status: "safe", trend: "live", baseline: 25.0 },
      turbidity: { value: 3.2, unit: "NTU", status: "safe", trend: "live", baseline: 3.0 },
      dissolvedOxygen: { value: 7.2, unit: "mg/L", status: "safe", trend: "live", baseline: 7.0 },
      conductivity: { value: 380, unit: "µS/cm", status: "safe", trend: "live", baseline: 400 }
    },
    remoteSensing: {
      ndti: 0.05,
      ndci: 0.03,
      turbidityIndex: "Live Hydro Sensor",
      algalBloomRisk: "Low Risk",
      satelliteSource: "IoT Buoy Telemetry",
      resolution: "Live Telemetry"
    }
  }
];

// ===== TIME SERIES DATA GENERATORS =====
export const getTimeSeriesData = (locationId, range = '24h', source = 'remote') => {
  const isArkavathi = locationId === 'arkavathi-bengaluru';
  const isLive = locationId === 'live-buoy-aqua-001';
  const baseTurbidity = isArkavathi ? 60 : isLive ? 2 : 22;
  const baseScore = isArkavathi ? 45 : isLive ? 0 : 82;

  if (range === '24h') {
    return [
      { time: '00:00', ndti: 0.12, ndci: 0.05, ph: 7.5, turbidity: baseTurbidity - 0.5, dissolvedOxygen: 7.2, score: baseScore + 2 },
      { time: '04:00', ndti: 0.14, ndci: 0.06, ph: 7.4, turbidity: baseTurbidity - 0.3, dissolvedOxygen: 7.0, score: baseScore + 1 },
      { time: '08:00', ndti: 0.19, ndci: 0.08, ph: 7.6, turbidity: baseTurbidity + 0.8, dissolvedOxygen: 6.9, score: baseScore - 3 },
      { time: '12:00', ndti: 0.24, ndci: 0.11, ph: 7.8, turbidity: baseTurbidity + 1.5, dissolvedOxygen: 6.5, score: baseScore - 6 },
      { time: '16:00', ndti: 0.22, ndci: 0.10, ph: 7.7, turbidity: baseTurbidity + 1.0, dissolvedOxygen: 6.6, score: baseScore - 4 },
      { time: '20:00', ndti: 0.18, ndci: 0.09, ph: 7.5, turbidity: baseTurbidity + 0.3, dissolvedOxygen: 6.8, score: baseScore - 1 },
      { time: 'Now', ndti: 0.18, ndci: 0.09, ph: 7.8, turbidity: baseTurbidity, dissolvedOxygen: 6.8, score: baseScore }
    ];
  } else if (range === '7d') {
    return [
      { time: 'Mon', ndti: 0.14, ndci: 0.05, ph: 7.4, turbidity: baseTurbidity - 0.8, dissolvedOxygen: 7.4, score: baseScore + 4 },
      { time: 'Tue', ndti: 0.15, ndci: 0.06, ph: 7.5, turbidity: baseTurbidity - 0.4, dissolvedOxygen: 7.1, score: baseScore + 2 },
      { time: 'Wed', ndti: 0.18, ndci: 0.08, ph: 7.6, turbidity: baseTurbidity + 0.2, dissolvedOxygen: 6.9, score: baseScore },
      { time: 'Thu', ndti: 0.26, ndci: 0.14, ph: 7.9, turbidity: baseTurbidity + 2.4, dissolvedOxygen: 6.2, score: baseScore - 8 },
      { time: 'Fri', ndti: 0.22, ndci: 0.11, ph: 7.7, turbidity: baseTurbidity + 1.4, dissolvedOxygen: 6.5, score: baseScore - 5 },
      { time: 'Sat', ndti: 0.19, ndci: 0.09, ph: 7.6, turbidity: baseTurbidity + 0.6, dissolvedOxygen: 6.7, score: baseScore - 2 },
      { time: 'Sun', ndti: 0.18, ndci: 0.09, ph: 7.8, turbidity: baseTurbidity, dissolvedOxygen: 6.8, score: baseScore }
    ];
  } else {
    return [
      { time: 'Week 1', ndti: 0.13, ndci: 0.05, ph: 7.4, turbidity: baseTurbidity - 1.0, dissolvedOxygen: 7.3, score: baseScore + 5 },
      { time: 'Week 2', ndti: 0.17, ndci: 0.07, ph: 7.5, turbidity: baseTurbidity - 0.2, dissolvedOxygen: 7.0, score: baseScore + 1 },
      { time: 'Week 3', ndti: 0.25, ndci: 0.13, ph: 7.8, turbidity: baseTurbidity + 1.8, dissolvedOxygen: 6.3, score: baseScore - 7 },
      { time: 'Week 4', ndti: 0.18, ndci: 0.09, ph: 7.8, turbidity: baseTurbidity, dissolvedOxygen: 6.8, score: baseScore }
    ];
  }
};

// ===== USER PROFILE =====
export const USER_PROFILE = {
  name: "Dr. Jane Doe",
  role: "Senior Hydrologist",
  organization: "Global Water Watch",
  email: "j.doe@waterwatch.org",
  memberSince: "Oct 2022",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
  preferences: {
    pushNotifications: true,
    darkMode: false,
    dataSharing: true,
    autoRefreshMinutes: 5
  },
  history: [
    {
      locationId: "ganga-kanpur",
      title: "Ganga River - Kanpur Stretch",
      timestamp: "Today, 08:30 AM",
      score: 82,
      status: "Safe"
    },
    {
      locationId: "arkavathi-bengaluru",
      title: "Arkavathi Lake - Bengaluru",
      timestamp: "Yesterday, 14:15 PM",
      score: 48,
      status: "Critical"
    },
    {
      locationId: "colorado-alpha",
      title: "Colorado River - Station Alpha",
      timestamp: "Nov 12, 2024 • 08:30 AM",
      score: 91,
      status: "Safe"
    },
    {
      locationId: "mississippi-delta",
      title: "Mississippi River - Delta Point",
      timestamp: "Nov 10, 2024 • 14:15 PM",
      score: 68,
      status: "Elevated"
    },
    {
      locationId: "thames-central",
      title: "Thames River - Central London",
      timestamp: "Nov 05, 2024 • 09:45 AM",
      score: 86,
      status: "Safe"
    }
  ]
};