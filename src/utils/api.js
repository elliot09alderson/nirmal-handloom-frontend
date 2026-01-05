import axios from 'axios';

// API base URL - uses environment variable in production, defaults to relative path for dev
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsed = JSON.parse(userInfo);
                if (parsed && parsed.token) {
                    config.headers.Authorization = `Bearer ${parsed.token}`;
                }
            }
        } catch (error) {
            console.error('Error parsing userInfo from localStorage:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Helper function to get the correct image URL
 * Handles both absolute URLs (http/https) and relative paths from the backend
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // If it's already an absolute URL (from Cloudinary or external source)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    // For relative paths, prepend the API base URL
    const baseUrl = API_BASE_URL || '';
    return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default api;

