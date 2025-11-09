import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, updateUserName, postLogout } from "../apis/auth"; // ✅ 이름 변경
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  // ✅ 사용자 정보 가져오기
  const { data, isLoading } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const [name, setName] = useState("");

  // 서버 데이터가 오면 input에 반영
  useEffect(() => {
    if (data?.data?.name) {
      setName(data.data.name);
    }
  }, [data]);

  // ✅ 이름 수정 (낙관적 업데이트)
  const mutation = useMutation({
    mutationFn: updateUserName,
    onMutate: async (newName: string) => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });

      const previousData = queryClient.getQueryData(["myInfo"]);

      // ✅ 즉시 UI 업데이트
      queryClient.setQueryData(["myInfo"], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          name: newName, // ✅ 여기 name으로 변경
        },
      }));

      return { previousData };
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["myInfo"], context.previousData);
      }
      alert("이름 변경에 실패했습니다. 다시 시도해주세요.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });

  const handleChangeName = () => {
    if (!name.trim()) return;
    mutation.mutate(name);
  };

  const handleLogout = async () => {
    await postLogout();
    await logout();
    navigate("/");
  };

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1>{data?.data?.name}님 환영합니다 👋</h1>
      <img
        src={data?.data?.avatar || "이미지 없음"}
        alt="프로필 이미지"
        className="w-20 h-20 rounded-full"
      />
      <h3>{data?.data?.email}</h3>

      {/* ✅ 이름 수정 UI */}
      <div className="mt-4">
        <label className="block mb-2 font-semibold">이름 수정</label>
        <input
          placeholder = "이름 수정"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleChangeName}
          disabled={mutation.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {mutation.isPending ? "변경 중..." : "이름 변경"}
        </button>
      </div>

      <button
        className="cursor-pointer bg-red-300 rounded-sm p-5 hover:scale-90"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
