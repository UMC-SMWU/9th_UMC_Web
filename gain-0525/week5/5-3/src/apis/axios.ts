import axios, { AxiosError, type AxiosRequestHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string; // 서버에서 제공하면 optional
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터: 항상 최신 Access Token 적용
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokenJson = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const token = tokenJson ? JSON.parse(tokenJson) : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 → Refresh Token으로 재발급 후 요청 재시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean } }
  ) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshTokenJson = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
        const refreshToken = refreshTokenJson ? JSON.parse(refreshTokenJson) : null;
        if (!refreshToken) throw new Error("No refresh token");

        const refreshRes = await axios.post<RefreshTokenResponse>(
          `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
          { token: refreshToken }
        );

        const newAccessToken = refreshRes.data.accessToken;
        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(newAccessToken)
    );

        if (!originalRequest.headers) originalRequest.headers = {} as AxiosRequestHeaders;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        } as AxiosRequestHeaders;

        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh Token 실패 시 로그아웃
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

