import { Link } from "react-router-dom";
import { type ResponseMyInfoDto } from "../types/auth";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  user: ResponseMyInfoDto['data'] | null;
  accessToken: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, user, accessToken }) => {
  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 z-30`}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">메뉴</h2>
          <ul className="flex flex-col space-y-2">
            <li><Link to="/" onClick={closeSidebar} className="hover:text-blue-500">홈</Link></li>
            {accessToken && user ? (
              <li><Link to="/my" onClick={closeSidebar} className="hover:text-blue-500">마이페이지</Link></li>
            ) : (
              <>
                <li><Link to="/login" onClick={closeSidebar} className="hover:text-blue-500">로그인</Link></li>
                <li><Link to="/signup" onClick={closeSidebar} className="hover:text-blue-500">회원가입</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-30 z-20 md:hidden" onClick={closeSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;
