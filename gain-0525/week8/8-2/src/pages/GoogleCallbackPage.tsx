import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const { setTokens } = useAuth(); // AuthContext에서 상태 갱신 함수 가져오기

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userId = params.get("userId");
    const name = params.get("name");

    if (accessToken && refreshToken) {
      // 1️⃣ AuthContext 상태 갱신
      setTokens(accessToken, refreshToken);

      // 2️⃣ 필요하면 userId, name도 localStorage에 저장
      localStorage.setItem("userId", userId || "");
      localStorage.setItem("name", name || "");

      // 3️⃣ 로그인 후 메인 페이지로 SPA 이동
      navigate("/", { replace: true });
    } else {
      // 토큰 없으면 로그인 페이지로 이동
      navigate("/login", { replace: true });
    }
  }, [navigate, setTokens]);

  return <div>로그인 처리 중...</div>;
};

export default GoogleCallbackPage;
