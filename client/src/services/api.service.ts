
import axios from 'axios';
import { queryClient } from '@/lib/queryClient';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      queryClient.clear();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const ApiService = {
  get: <T>(url: string) => api.get<T>(url).then(res => res.data),
  post: <T>(url: string, data: any) => api.post<T>(url, data).then(res => res.data),
  put: <T>(url: string, data: any) => api.put<T>(url, data).then(res => res.data),
  delete: <T>(url: string) => api.delete<T>(url).then(res => res.data)
};
