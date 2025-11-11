import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/useAuth";

const HomeLayout = () => {
  const { accessToken } = useAuth();

  // Sidebar 너비만큼 오른쪽으로 밀기 (md 이상 화면)
  return (
    <div className="h-dvh flex">
      <Sidebar
        isOpen={false} // 작은 화면에서만 Navbar가 열어줌
        closeSidebar={() => {}}
        user={null}
        accessToken={accessToken}
      />
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <Navbar />
        <main className="flex-1 mt-16 p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default HomeLayout;


