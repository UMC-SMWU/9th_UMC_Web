import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp"; // /v1/lp/:lpid 호출 API
import { useAuth } from "../context/useAuth";
import type { ResponseLpDto } from "../types/lp";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  // 로그인 체크
  const showLoginAlert = !accessToken;

  const { data, isLoading, isError, refetch } = useQuery<ResponseLpDto>({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(Number(lpid)),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!lpid && !!accessToken,
  });

  const handleAlertConfirm = () => {
    // 로그인 페이지 이동 + 원래 페이지 정보 전달
    navigate("/login", { state: { from: `/lp/${lpid}` } });
  };

  const handleLike = () => console.log("좋아요!");
  const handleEdit = () => navigate(`/lp/${lpid}/edit`);
  const handleDelete = () => { console.log("삭제!"); navigate("/"); }

  if (showLoginAlert) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded p-6 max-w-sm w-full text-center shadow-lg">
          <p className="mb-4">로그인이 필요합니다.</p>
          <button
            onClick={handleAlertConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) return <div>로딩중...</div>;
  if (isError)
    return (
      <div>
        <p>데이터를 불러오는 중 오류 발생!</p>
        <button onClick={() => refetch()} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
          재시도
        </button>
      </div>
    );

  if (!data?.data) return <div>데이터가 없습니다.</div>;

  const lp = data.data;

  return (
    <div className="max-w-4xl mx-auto mt-20 p-4 space-y-6">
      <div className="w-full h-80 overflow-hidden rounded-lg shadow">
        <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{lp.title}</h1>
        <p className="text-gray-500 text-sm">업로드: {new Date(lp.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="prose max-w-full">
        <p>{lp.content}</p>
      </div>
      <div className="flex space-x-4">
        <button onClick={handleLike} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          좋아요 ({lp.likes?.length || 0})
        </button>
        <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">수정</button>
        <button onClick={handleDelete} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">삭제</button>
      </div>
    </div>
  );
};

export default LpDetailPage;


