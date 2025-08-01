// model/api/storeAPI.ts
import { apiClient } from '@/app/api/apiClient';
import { STORE_API_URL, HUGGING_FACE_USER_ID, HUGGING_FACE_TOKEN, MINIO_URL, MINIO_ACCESS_KEY, MINIO_SECRET_KEY } from '../config';

const API_BASE_URL = STORE_API_URL;

const buildUrl = (path: string, params: Record<string, string>) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  url.searchParams.append('hugging_face_user_id', HUGGING_FACE_USER_ID);
  url.searchParams.append('hugging_face_token', HUGGING_FACE_TOKEN);
  url.searchParams.append('minio_url', MINIO_URL);
  url.searchParams.append('minio_access_key', MINIO_ACCESS_KEY);
  url.searchParams.append('minio_secret_key', MINIO_SECRET_KEY);
  return url.toString();
};

export const StoreAPI = {
  fetchItems: async (type: 'models' | 'datasets') => {
    const bucket_name = type === 'models' ? 'models' : 'data';
    const url = buildUrl('/subfolders', { bucket_name });

    const response = await apiClient(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}`);
    }
    return response.json();
  },

  fetchDatasetDetails: async (datasetName: string) => {
    const url = buildUrl('/dataset/info', {
      dataset_name: datasetName,
      bucket_name: 'data',
      return_origin: 'true',
    });

    const response = await apiClient(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch dataset details');
    }
    return response.json();
  },
};