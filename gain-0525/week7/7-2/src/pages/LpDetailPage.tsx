import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp";
import type { ResponseLpDto } from "../types/lp";
import { useAuth } from "../context/useAuth";
import { PAGINATION_ORDER } from "../enums/common";
import { useGetLpComments } from "../hooks/queries/useGetLpComment";
import { usePostLike } from "../hooks/mutations/usePostLike";
import { useDeleteLike } from "../hooks/mutations/useDeleteLike";
import { usePostComment } from "../hooks/mutations/usePostComment";
import { useUpdateComment } from "../hooks/mutations/useUpdateComment";
import { useDeleteComment } from "../hooks/mutations/useDeleteComment";

const SKELETON_COUNT = 4;

// 댓글 작성 폼
const CommentForm = ({ lpId }: { lpId: number }) => {
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const postCommentMutation = usePostComment(lpId, PAGINATION_ORDER.desc);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }
    setError("");
    postCommentMutation.mutate(newComment, {
      onSuccess: () => setNewComment(""),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h3 className="text-lg font-semibold mb-2">댓글 작성</h3>
      <textarea
        name="comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border rounded-md p-2"
        rows={3}
        placeholder="댓글을 입력하세요..."
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <button
        type="submit"
        disabled={postCommentMutation.isPending}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        댓글 등록
      </button>
    </form>
  );
};

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const numericLpId = Number(lpid);
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const showLoginAlert = !accessToken;

  const userId = Number(localStorage.getItem("userId"));
  const queryClient = useQueryClient();

  // LP 상세 정보
  const { data: lpData, isLoading: isLpLoading, isError: isLpError, refetch } =
    useQuery<ResponseLpDto>({
      queryKey: ["lp", numericLpId],
      queryFn: () => getLpDetail(numericLpId),
      staleTime: 1000 * 60 * 5,
      enabled: numericLpId > 0,
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

  // 좋아요 상태 계산
  const hasLiked = useMemo(() => {
    if (!lpData?.data || !accessToken) return false;
    return lpData.data.likes.some((like) => like.userId === userId);
  }, [lpData, accessToken, userId]);

  const postLikeMutation = usePostLike(numericLpId);
  const deleteLikeMutation = useDeleteLike(numericLpId);

  // 댓글 수정 / 삭제 훅
  const updateCommentMutation = useUpdateComment(numericLpId);
  const deleteCommentMutation = useDeleteComment(numericLpId);

  // 댓글 수정 상태 관리
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleEdit = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editedContent.trim()) return alert("내용을 입력해주세요.");
    updateCommentMutation.mutate(
      { commentId, content: editedContent },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditedContent("");
          queryClient.invalidateQueries({ queryKey: ["lpComments", numericLpId] });
        
        },
      }
    );
  };

  const handleDelete = (commentId: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate(commentId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["lpComments", numericLpId] });
        }
      });
      
    }
  };

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
            onClick={() =>
              navigate("/login", { state: { from: `/lp/${lpid}` } })
            }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  if (isLpLoading)
    return <div className="mt-20 px-4 text-center">LP 정보 로딩중...</div>;
  if (isLpError)
    return (
      <div className="mt-20 px-4 text-center">
        <p>데이터를 불러오는 중 오류 발생!</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          재시도
        </button>
      </div>
    );

  if (!lpData?.data)
    return <div className="mt-20 px-4 text-center">데이터가 없습니다.</div>;
  const lp = lpData.data;

  return (
    <div className="max-w-4xl mx-auto mt-20 p-4 space-y-6">
      {/* LP 상세 */}
      <div className="w-full h-80 overflow-hidden rounded-lg shadow">
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-2xl font-bold">{lp.title}</h1>
      <p className="text-gray-500 text-sm">
        업로드: {new Date(lp.createdAt).toLocaleDateString()}
      </p>
      <p>{lp.content}</p>

      {/* 좋아요 버튼 */}
      <button
        onClick={() => {
          if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
          }
          if (hasLiked) deleteLikeMutation.mutate();
          else postLikeMutation.mutate();
        }}
        className="mt-4 px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300"
      >
        {hasLiked ? "❤️ 좋아요 취소" : "🤍 좋아요"} ({lp.likes.length})
      </button>

      {/* 댓글 섹션 */}
      <div>
        <CommentForm lpId={numericLpId} />

        {/* 정렬 버튼 */}
        <div className="flex space-x-2 my-4">
          <button
            onClick={() => setSort(PAGINATION_ORDER.desc)}
            className={`px-3 py-1 rounded text-sm ${
              sort === PAGINATION_ORDER.desc
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSort(PAGINATION_ORDER.asc)}
            className={`px-3 py-1 rounded text-sm ${
              sort === PAGINATION_ORDER.asc
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-black"
            }`}
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
            : comments.map((comment) => {
                const isMyComment = comment.author?.id === userId;

                return (
                  <div key={comment.id} className="border-b pb-2">
                    <p className="font-semibold">
                      {comment.author?.name || "익명"}
                    </p>

                    {editingCommentId === comment.id ? (
                      <div>
                        <textarea
                          placeholder="댓글을 입력하세요"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full border rounded p-2 text-sm"
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleSaveEdit(comment.id)}
                            className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                          >
                            저장
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-2 py-1 text-sm bg-gray-300 rounded"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700">{comment.content}</p>
                    )}

                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>

                    {isMyComment && editingCommentId !== comment.id && (
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() =>
                            handleEdit(comment.id, comment.content)
                          }
                          className="text-blue-500 text-sm hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
        </div>

        {/* 무한 스크롤 로딩 영역 */}
        <div
          ref={observerRef}
          className="h-10 flex justify-center items-center mt-4"
        >
          {isFetchingNextPage &&
            Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
              <div
                key={idx}
                className="h-16 w-full rounded bg-gray-300 animate-pulse my-1"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;
