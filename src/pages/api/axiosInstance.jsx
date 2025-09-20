// src/axiosSetup.js
import axios from "axios";
import { BASE_URL } from '../Url';


const axiosInstance = axios.create({
  withCredentials: true, // Ensure cookies are sent with requests
});
let isRefreshing = false;

axiosInstance.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('refresh')) {
      if (isRefreshing) return Promise.reject(err); // prevent multiple refreshes
      isRefreshing = true;
      originalRequest._retry = true;
      try {
        await axios.post(`${BASE_URL}api/auth/refresh/`, null, { withCredentials: true });
        isRefreshing = false;
        return axios(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);


export default axiosInstance;