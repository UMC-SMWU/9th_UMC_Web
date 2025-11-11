import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      navigate("/");
    } else {
      alert("구글 로그인 실패");
      navigate("/login");
    }
  }, [location.search]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-lg">
      구글 로그인 처리 중입니다...
    </div>
  );
};

export default OAuthCallback;
