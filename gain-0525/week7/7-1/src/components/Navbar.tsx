import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { getMyInfo } from '../apis/auth';
import { type ResponseMyInfoDto } from '../types/auth';
import Sidebar from './Sidebar';

const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const [user, setUser] = useState<ResponseMyInfoDto['data'] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (accessToken) {
      const fetchUser = async () => {
        try {
          const response = await getMyInfo();
          setUser(response.data || null);
        } catch (e) {
          console.error('유저 정보 불러오기 실패', e);
        }
      };
      fetchUser();
    } else {
      setUser(null);
    }
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full z-40">
  <div className="flex items-center p-4 transition-all duration-300">
    {/* 햄버거 버튼 */}
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

    {/* 로고 */}
    <Link to="/" className="ml-2 text-xl font-bold text-black">
      SpinningSpinning Dolimpan
    </Link>

    {/* 오른쪽 영역 */}
    <div className="flex items-center space-x-4">
      {accessToken && user ? (
        <>
          <span className="text-black md:ml-128">{user.name}님 반갑습니다.</span>
          <button
            onClick={handleLogout}
            className="text-black hover:text-red-500"
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-black hover:text-blue-500 ml-160">로그인</Link>
          <Link to="/signup" className="text-black hover:text-blue-500">회원가입</Link>
        </>
      )}
      <Link to="/search" className="text-black hover:text-blue-500">검색</Link>
    </div>
  </div>

  {/* Sidebar */}
  <Sidebar
    isOpen={sidebarOpen}
    closeSidebar={() => setSidebarOpen(false)}
    user={user}
    accessToken={accessToken}
  />
</nav>


      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        user={user}
        accessToken={accessToken}
      />
    </>
  );
};

export default Navbar;

