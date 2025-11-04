import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/useAuth";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) return <Navigate to="/login" replace />;

  return (
    <div className="h-dvh flex">
      {/* Sidebar 공간 확보 (Desktop) */}
      <div className="hidden md:block w-64 flex-shrink-0"></div>

      {/* 메인 영역 */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 mt-16 md:ml-64 p-4 transition-all duration-300">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ProtectedLayout;



