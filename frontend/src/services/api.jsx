// frontend/src/services/api.js

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

// ===== GET LATEST IoT DATA FROM BACKEND =====
export const getIoTData = async (deviceId = 'AQUA-001') => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/sensor-data/latest/${deviceId}`);
        if (!response.ok) throw new Error('Failed to fetch IoT data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('⚠️ IoT data not available:', error.message);
        throw error;
    }
};

// ===== GET IoT HISTORY FOR CHART =====
export const getIoTHistory = async (deviceId = 'AQUA-001', limit = 24) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/sensor-data/history/${deviceId}?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch IoT history');
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('⚠️ IoT history not available:', error.message);
        throw error;
    }
};

// ===== VERIFY DATA ON BLOCKCHAIN =====
export const verifyData = async (dataHash) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/sensor-data/verify/${dataHash}`);
        if (!response.ok) throw new Error('Verification failed');
        return await response.json();
    } catch (error) {
        console.error('❌ Error verifying data:', error);
        throw error;
    }
};