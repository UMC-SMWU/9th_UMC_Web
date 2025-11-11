// HomeLayout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useState, useEffect } from "react";

const HomeLayout = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { getItem: getAccessToken, removeItem: removeAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  // 로그인 상태 확인 (마운트 시 한 번만)
  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);
  }, [getAccessToken]);

  // 로그아웃 처리
  const handleLogout = () => {
    removeAccessToken();
    removeRefreshToken();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="h-dvh flex flex-col">
      <nav className="bg-transparent text-black h-16 px-6 flex items-center border border-gray-400">
        <div className="flex items-center gap-6 ml-auto">
          {isLoggedIn ? (
            <>
              <span className="text-green-600 font-medium">로그인 완료</span>
              <button onClick={handleLogout} className="hover:underline text-red-500">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                로그인
              </Link>
              <Link to="/signup" className="hover:underline">
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="text-center py-2 border-t border-gray-300">
        푸터입니다.
      </footer>
    </div>
  );
};

export default HomeLayout;
