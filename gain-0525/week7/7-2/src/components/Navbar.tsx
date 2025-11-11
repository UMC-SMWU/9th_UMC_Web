// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyInfo } from '../apis/auth';
import Sidebar from './Sidebar';

const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();
  

  const { data: userData } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  const user = userData?.data ?? null;

  const handleLogout = async () => {
    await logout();
    queryClient.invalidateQueries({ queryKey: ["myInfo"] }); // 캐시 무효화
    setSidebarOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-40">
      <div className="flex items-center p-4 transition-all duration-300">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="메뉴 열기"
          className="p-2 md:hidden text-black"
        >
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

        <Link to="/" className="ml-2 text-xl font-bold text-black">
          SpinningSpinning Dolimpan
        </Link>

        <div className="flex-1 flex items-center space-x-4" style={{ marginLeft: '16rem' }}>
          {accessToken && user ? (
            <>
              <span className="text-black">{user.name}님 반갑습니다.</span>
              <button
                onClick={handleLogout}
                className="text-black hover:text-red-500"
              >
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
          <Link to="/search" className="text-black hover:text-blue-500">검색</Link>
        </div>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        user={user}
        accessToken={accessToken}
      />
    </nav>
  );
};

export default Navbar;
