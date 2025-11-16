// src/components/Sidebar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "./ConfirmModal";
import { axiosInstance } from "../apis/axios";
import type { ResponseMyInfoDto } from "../types/auth";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  user: ResponseMyInfoDto["data"] | null;
  accessToken: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, user, accessToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete("/v1/users");
      return response.data;
    },
    onSuccess: () => {
      alert("회원 탈퇴 완료");
      localStorage.removeItem("accessToken");
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      navigate("/login");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "회원 탈퇴 실패");
    },
  });

  const handleConfirm = () => {
    setIsModalOpen(false);
    closeSidebar();
    withdrawMutation.mutate();
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} z-50 flex flex-col justify-between`}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">메뉴</h2>
          <ul className="flex flex-col space-y-2">
            <li>
              <Link to="/" onClick={closeSidebar} className="hover:text-blue-500">
                홈
              </Link>
            </li>
            {accessToken && user ? (
              <li>
                <Link to="/my" onClick={closeSidebar} className="hover:text-blue-500">
                  마이페이지
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={closeSidebar} className="hover:text-blue-500">
                    로그인
                  </Link>
                </li>
                <li>
                  <Link to="/signup" onClick={closeSidebar} className="hover:text-blue-500">
                    회원가입
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {accessToken && user && (
          <div className="p-4 border-t">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full text-gray-500 py-2 rounded hover:text-red-600 transition-colors text-center"
            >
              회원탈퇴
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-30 z-40" onClick={closeSidebar}></div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="회원 탈퇴"
        message="정말 회원 탈퇴를 진행하시겠습니까?"
      />
    </>
  );
};

export default Sidebar;
