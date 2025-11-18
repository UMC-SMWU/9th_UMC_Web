// src/layouts/HomeLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useState } from "react";

const HomeLayout = () => {
  const { accessToken } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 로그인 상태면 내 정보 조회
  const { data: userData } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  const user: ResponseMyInfoDto["data"] | null = userData?.data ?? null;

  return (
    <div className="h-dvh flex">
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        user={user}
        accessToken={accessToken}
      />

      <div className="flex-1 flex flex-col transition-all duration-300">
        <Navbar openSidebar={() => setIsSidebarOpen(true)} user={user} />
        <main className="flex-1 mt-16 p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default HomeLayout;
