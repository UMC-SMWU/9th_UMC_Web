import { createContext, useEffect, useState, type PropsWithChildren } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { RequestSigninDto } from "../types/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";
import { axiosInstance } from "../apis/axios";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (access: string, refresh: string) => void; // 콜백용
  
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
  setTokens: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );

  // 토큰 갱신
  useEffect(() => {
    const initializeAuth = async () => {
      if (refreshToken) {
        try {
          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });

          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;

          setAccessTokenInStorage(newAccessToken);
          setRefreshTokenInStorage(newRefreshToken);

          setAccessToken(newAccessToken);
          setRefreshToken(newRefreshToken);
        } catch (err) {
          console.error("자동 로그인 실패", err);
          removeAccessTokenFromStorage();
          removeRefreshTokenFromStorage();
          setAccessToken(null);
          setRefreshToken(null);
        }
      }
    };
    initializeAuth();
  }, []);

  const login = async (signinData: RequestSigninDto, callback?: () => void) => {
    try {
      const { data } = await postSignin(signinData);

      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        if (callback) callback(); // navigate 처리
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인 실패");
    }
  };

  const setTokens = (newAccess: string, newRefresh: string) => {
    setAccessTokenInStorage(newAccess);
    setRefreshTokenInStorage(newRefresh);
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
  };

  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      alert("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 오류", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, setTokens }}
    >
      {children}
    </AuthContext.Provider>
  );
};
