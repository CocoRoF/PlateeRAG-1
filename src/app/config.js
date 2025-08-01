/**
 * Application configuration settings
 */

const host_url = process.env.NEXT_PUBLIC_BACKEND_HOST || 'http://localhost'
const port = process.env.NEXT_PUBLIC_BACKEND_PORT || null

const metrics = process.env.NEXT_PUBLIC_METRICS_HOST || ''

const store_api_url = process.env.NEXT_PUBLIC_STORE_API_URL || ''
const hugginface_user_id = process.env.NEXT_PUBLIC_HUGGING_FACE_USER_ID || ''
const hugginface_token = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN || ''

export const HUGGING_FACE_USER_ID = hugginface_user_id
export const HUGGING_FACE_TOKEN = hugginface_token
export const STORE_API_URL = store_api_url

const minio_url = process.env.NEXT_PUBLIC_MINIO_URL || ''
const minio_access_key = process.env.NEXT_PUBLIC_MINIO_ACCESS_KEY || ''
const minio_secret_key = process.env.NEXT_PUBLIC_MINIO_SECRET_KEY || ''

export const MINIO_URL = minio_url
export const MINIO_ACCESS_KEY = minio_access_key
export const MINIO_SECRET_KEY = minio_secret_key

let BASE_URL = `${host_url}:${port}`

if (!port) {
    BASE_URL = host_url
}

console.log(`Backend server running at ${BASE_URL}`);
// API Configuration
export const API_CONFIG = {
    BASE_URL: BASE_URL,
    TIMEOUT: 30000, // 30 seconds
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
    },
};

export const APP_CONFIG = {
    DEFAULT_THEME: 'light',
    DEBUG_MODE: process.env.NODE_ENV === 'development',
};

// Export individual configs for convenience
export const { BASE_URL: API_BASE_URL } = API_CONFIG;

export const METRICS_URL = metrics;