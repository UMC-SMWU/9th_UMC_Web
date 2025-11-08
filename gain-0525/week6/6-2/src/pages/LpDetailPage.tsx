import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp";
import { useAuth } from "../context/useAuth";
import { PAGINATION_ORDER } from "../enums/common";
import { useGetLpComments } from "../hooks/queries/useGetLpComment"; // 수정된 훅 사용
import type { ResponseLpDto } from "../types/lp";

const SKELETON_COUNT = 4; // 댓글 스켈레톤 개수

// 댓글 작성 폼
const CommentForm = ({ lpId }: { lpId: number }) => {
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!newComment.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }
    setError("");
    console.log(`[LP ID: ${lpId}] 댓글 생성 시도:`, newComment);
    setNewComment("");
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">댓글 작성</h3>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border rounded-md p-2"
        rows={3}
        placeholder="댓글을 입력하세요..."
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        댓글 등록
      </button>
    </div>
  );
};

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const numericLpId = Number(lpid);
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const showLoginAlert = !accessToken;

  // LP 상세 정보
  const { data: lpData, isLoading: isLpLoading, isError: isLpError, refetch } = useQuery<ResponseLpDto>({
    queryKey: ["lp", numericLpId],
    queryFn: () => getLpDetail(numericLpId),
    staleTime: 1000 * 60 * 5,
    enabled: !!numericLpId && !!accessToken,
  });

  // 댓글 무한 쿼리 + 정렬
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: comments = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
  } = useGetLpComments({
    lpId: numericLpId,
    order: sort,
    limit: 8,
  });

  // 댓글 무한 스크롤
  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (showLoginAlert) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded p-6 max-w-sm w-full text-center shadow-lg">
          <p className="mb-4">로그인이 필요합니다.</p>
          <button
            onClick={() => navigate("/login", { state: { from: `/lp/${lpid}` } })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  if (isLpLoading) return <div className="mt-20 px-4 text-center">LP 정보 로딩중...</div>;
  if (isLpError) return (
    <div className="mt-20 px-4 text-center">
      <p>데이터를 불러오는 중 오류 발생!</p>
      <button onClick={() => refetch()} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">재시도</button>
    </div>
  );

  if (!lpData?.data) return <div className="mt-20 px-4 text-center">데이터가 없습니다.</div>;
  const lp = lpData.data;

  return (
    <div className="max-w-4xl mx-auto mt-20 p-4 space-y-6">
      {/* LP 상세 */}
      <div className="w-full h-80 overflow-hidden rounded-lg shadow">
        <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
      </div>
      <h1 className="text-2xl font-bold">{lp.title}</h1>
      <p className="text-gray-500 text-sm">업로드: {new Date(lp.createdAt).toLocaleDateString()}</p>
      <p>{lp.content}</p>

      {/* 댓글 섹션 */}
      <div>
        <CommentForm lpId={numericLpId} />

        {/* 정렬 버튼 */}
        <div className="flex space-x-2 my-4">
          <button
            onClick={() => setSort(PAGINATION_ORDER.desc)}
            className={`px-3 py-1 rounded text-sm ${sort === PAGINATION_ORDER.desc ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
          >
            최신순
          </button>
          <button
            onClick={() => setSort(PAGINATION_ORDER.asc)}
            className={`px-3 py-1 rounded text-sm ${sort === PAGINATION_ORDER.asc ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
          >
            오래된순
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {isCommentsLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                <div key={idx} className="h-16 rounded bg-gray-300 animate-pulse" />
              ))
            : comments.map((comment) => (
                <div key={comment.id} className="border-b pb-2">
                  <p className="font-semibold">{comment.author?.name || "익명"}</p>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
              ))}
        </div>

        {/* 하단 무한 스크롤 스켈레톤 */}
        <div ref={observerRef} className="h-10 flex justify-center items-center mt-4">
          {isFetchingNextPage &&
            Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
              <div key={idx} className="h-16 w-full rounded bg-gray-300 animate-pulse my-1" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;
