// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import type { ResponseMyInfoDto } from "../types/auth";

interface NavbarProps {
  openSidebar: () => void;
  user: ResponseMyInfoDto["data"] | null;
}

const Navbar = ({ openSidebar, user }: NavbarProps) => {
  const { accessToken, logout } = useAuth();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.invalidateQueries({ queryKey: ["myInfo"] });
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-40">
      <div className="flex items-center p-4">
        {/* 햄버거 */}
        <button onClick={openSidebar} aria-label="메뉴 열기" className="p-2 text-black">
          <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"
            />
          </svg>
        </button>

        {/* 로고 */}
        <Link to="/" className="ml-2 text-xl font-bold text-black">
          SpinningSpinning Dolimpan
        </Link>

        {/* 오른쪽 끝으로 밀기 */}
        <div className="ml-auto flex items-center space-x-4">
          {accessToken && user ? (
            <>
              <span className="text-black">{user.name}님 반갑습니다.</span>
              <button onClick={handleLogout} className="text-black hover:text-red-500">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-black hover:text-blue-500">
                로그인
              </Link>
              <Link to="/signup" className="text-black hover:text-blue-500">
                회원가입
              </Link>
            </>
          )}
          <Link to="/search" className="text-black hover:text-blue-500">
            검색
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
