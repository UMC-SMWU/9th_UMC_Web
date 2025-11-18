import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useAuth } from "../context/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import { useState } from "react";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  // Hooks는 항상 최상단에서
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  const user = userData?.data ?? null;

  // 로그인 안 되어 있으면 redirect
  if (!accessToken) return <Navigate to="/login" replace />;

  return (
    <div className="h-dvh flex">
      {/* Sidebar: 슬라이드 */}
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        user={user}
        accessToken={accessToken}
      />

      <div className="flex-1 flex flex-col">
        {/* Navbar: 햄버거 클릭 시 Sidebar 열기 */}
        <Navbar openSidebar={() => setIsSidebarOpen(true)} user={user} />

        <main className="flex-1 mt-16 p-4">
          <Outlet context={{ user }} />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ProtectedLayout;
