import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`,
    },
});


// 요청 인터셉터
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  
  if (!config.headers) {
    config.headers = {} as any;
  }

  (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  return config;
});