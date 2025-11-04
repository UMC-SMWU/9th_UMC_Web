import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp"; // /v1/lp/:lpid 호출 API
import { useAuth } from "../context/useAuth";
import type { ResponseLpDto } from "../types/lp";

// 댓글 관련 훅과 타입 임포트
import { PAGINATION_ORDER } from "../enums/common";
import useGetLpComments from "../hooks/queries/useGetLpComment";

/**
 * [요구사항 3] 댓글 작성란 (UI만 구현)
 */
const CommentForm = ({ lpId }: { lpId: number }) => {
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(""); // 유효성 안내

  const handleSubmit = () => {
    if (!newComment.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }
    setError("");
    
    // TODO: 여기에 댓글 생성 useMutation 훅을 연결합니다.
    console.log(`[LP ID: ${lpId}] 댓글 생성 시도:`, newComment); 
    
    setNewComment("");
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">댓글 작성</h3>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border rounded-md p-2"
        rows={3}
        placeholder="따뜻한 댓글을 남겨주세요..."
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


/**
 * LP 상세 페이지
 */
const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const numericLpId = Number(lpid); // 숫자 타입 ID
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const showLoginAlert = !accessToken;

  // --- 1. [기존] LP 상세 정보 쿼리 ---
  const { 
    data: lpDetailData, 
    isLoading: isLpLoading, 
    isError: isLpError, 
    refetch 
  } = useQuery<ResponseLpDto>({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(numericLpId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!lpid && !!accessToken, // 로그인 시에만 실행
  });

  // --- 2. [신규] 댓글 목록 쿼리 ---
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  const {
    data: comments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpComments({
    lpId: numericLpId,
    order: sort, // [요구사항 2] order를 훅에 전달
    limit: 10,
    // (참고: useGetLpComments 훅 자체에 enabled 옵션을 추가하는 것도 좋습니다)
    // enabled: !!lpid && !!accessToken,
  });

  // [신규] 무한 스크롤 Intersection Observer
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage(); // [요구사항 1] 트리거에서 fetchNextPage() 호출
      }
    };
    const observer = new IntersectionObserver(observerCallback, { threshold: 1.0 });
    const currentTarget = observerTargetRef.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => { if (currentTarget) observer.unobserve(currentTarget) };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


  // --- 핸들러 함수들 ---
  const handleAlertConfirm = () => {
    navigate("/login", { state: { from: `/lp/${lpid}` } });
  };

  const handleLike = () => console.log("좋아요!");
  const handleEdit = () => navigate(`/lp/${lpid}/edit`);
  const handleDelete = () => { console.log("삭제!"); navigate("/"); }

  // --- 렌더링 로직 ---

  // 1. 로그인 얼럿
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

  // 2. LP 상세 정보 로딩
  if (isLpLoading) return <div className="mt-20 px-4 text-center">LP 정보 로딩중...</div>;
  
  // 3. LP 상세 정보 에러
  if (isLpError)
    return (
      <div className="mt-20 px-4 text-center">
        <p>데이터를 불러오는 중 오류 발생!</p>
        <button onClick={() => refetch()} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
          재시도
        </button>
      </div>
    );

  // 4. LP 데이터 없음
  if (!lpDetailData?.data) return <div className="mt-20 px-4 text-center">데이터가 없습니다.</div>;

  const lp = lpDetailData.data;

  // 5. 최종 렌더링
  return (
    <div className="max-w-4xl mx-auto mt-20 p-4 space-y-6">
      {/* --- LP 상세 정보 섹션 --- */}
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

      <hr className="my-8" />

      {/* --- 댓글 섹션 --- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">댓글</h2>
        
        {/* [요구사항 3] 댓글 작성 폼 UI */}
        <CommentForm lpId={numericLpId} />

        {/* [요구사항 2] 정렬 버튼 */}
        <div className="flex space-x-2 my-6">
          <button
            onClick={() => setSort(PAGINATION_ORDER.desc)}
            className={`px-3 py-1 rounded text-sm ${
              sort === PAGINATION_ORDER.desc ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSort(PAGINATION_ORDER.asc)}
            className={`px-3 py-1 rounded text-sm ${
              sort === PAGINATION_ORDER.asc ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
            }`}
          >
            오래된순
          </button>
        </div>

        {/* 댓글 목록 */}
        {isCommentsLoading && <div className="text-gray-500">댓글 로딩중...</div>}
        {isCommentsError && <div className="text-red-500">댓글을 불러오는 중 오류 발생!</div>}
        {!isCommentsLoading && !comments?.length && <div className="text-gray-500">아직 댓글이 없습니다.</div>}
        
        <div className="space-y-4">
          {comments?.map((comment) => (
            <div key={comment.id} className="border-b pb-2">
              <p className="font-semibold">{comment.author?.name || '익명'}</p>
              <p className="text-gray-700">{comment.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* [요구사항 1] 무한 스크롤 타겟 및 로더 */}
        <div ref={observerTargetRef} className="h-10 flex justify-center items-center mt-4">
          {isFetchingNextPage ? (
            <div className="text-gray-500">다음 댓글 불러오는 중...</div>
          ) : (
            !hasNextPage && comments && comments.length > 0 && 
            <div className="text-gray-500">마지막 댓글입니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;