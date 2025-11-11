// src/components/Sidebar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "./ConfirmModal";
import { axiosInstance } from "../apis/axios";
import { type ResponseMyInfoDto } from "../types/auth";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  user: ResponseMyInfoDto['data'] | null;
  accessToken: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, user, accessToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ✅ 캐시 무효화용

  // 회원 탈퇴 mutation
  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete("/v1/users");
      return response.data;
    },
    onSuccess: () => {
      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("accessToken"); // 로그아웃 처리
      queryClient.invalidateQueries({ queryKey: ["myInfo"] }); // ✅ 캐시 무효화
      navigate("/login"); // 로그인 페이지 이동
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "회원 탈퇴 실패");
    },
  });

  const handleWithdrawClick = () => setIsModalOpen(true);

  const handleConfirm = () => {
    setIsModalOpen(false);
    closeSidebar();
    withdrawMutation.mutate(); // 실제 탈퇴 API 호출
  };

  return (
    <>
      {/* 사이드바 */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 z-30 flex flex-col justify-between`}>
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

        {/* 회원 탈퇴 버튼 */}
        {accessToken && user && (
          <div className="p-4 border-t">
            <button
              onClick={handleWithdrawClick}
              className="w-full text-gray-500 py-2 rounded hover:text-red-600 transition-colors text-left"
            >
              회원탈퇴
            </button>
          </div>
        )}
      </div>

      {/* 배경 클릭 시 닫기 */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-30 z-20 md:hidden" onClick={closeSidebar}></div>}

      {/* 확인 모달 */}
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
