import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PAGINATION_ORDER } from "../enums/common";
import { useGetInfiniteLpList } from "../hooks/queries/useGetInfiniteLpList";
import clsx from "clsx";

const SKELETON_COUNT = 8;

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetInfiniteLpList({ limit: 10, search, order: sort });

  const observerRef = useRef<HTMLDivElement | null>(null);

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  // 무한 스크롤 트리거
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

  if (isError) return <div>데이터를 불러오는 중 오류 발생!</div>;

  return (
    <div className="mt-20 px-4">
      {/* 정렬 버튼 */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setSort(PAGINATION_ORDER.desc)}
          className={clsx(
            "px-4 py-2 rounded",
            sort === PAGINATION_ORDER.desc
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          )}
        >
          최신순
        </button>
        <button
          onClick={() => setSort(PAGINATION_ORDER.asc)}
          className={clsx(
            "px-4 py-2 rounded",
            sort === PAGINATION_ORDER.asc
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          )}
        >
          오래된순
        </button>
      </div>

      {/* 상단 스켈레톤 */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            <div
              key={idx}
              className="relative border rounded-lg overflow-hidden shadow bg-gray-400 animate-pulse h-48"
            >
          <div className="absolute inset-0 bg-gray-500/50" />
        </div>
      ))}
    </div>
  )}

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {lps.map((lp) => (
          <div
            key={lp.id}
            className="relative border rounded-lg overflow-hidden shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
            onClick={() => navigate(`/lp/${lp.id}`)}
          >
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4 text-white">
              <h2 className="font-semibold">{lp.title}</h2>
              <p className="text-sm mt-1">
                업로드: {new Date(lp.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm mt-1">좋아요: {lp.likes?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 스켈레톤 */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            <div
              key={idx}
              className="relative border rounded-lg overflow-hidden shadow bg-gray-400 animate-pulse h-48"
            >
              <div className="absolute inset-0 bg-gray-500/50" />
            </div>
          ))}
        </div>
      )}

      {/* 스크롤 끝 트리거 div */}
      <div ref={observerRef} className="h-1" />
    </div>
  );
};

export default HomePage;
