import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PAGINATION_ORDER } from "../enums/common";
import { useGetInfiniteLpList } from "../hooks/queries/useGetInfiniteLpList";
import clsx from "clsx";
import Modal from "../components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";
import useThrottle from "../hooks/useThrottle";

const SKELETON_COUNT = 8;

interface LPData {
  name: string;
  content: string;
  tags: string[];
  file: File | null;
}

const HomePage = () => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchType, setSearchType] = useState<"title" | "tag">("title");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useGetInfiniteLpList({ limit: 10, search: debouncedValue, order: sort, searchType });

  const observerRef = useRef<HTMLDivElement | null>(null);
  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  // LP 추가 mutation
  const createLp = useMutation({
    mutationFn: async (lpData: LPData) => {
      const { data } = await axiosInstance.post("/v1/lps", {
        title: lpData.name,
        content: lpData.content,
        tags: lpData.tags,
        published: true,
        thumbnail: `https://picsum.photos/seed/${Math.random()}/400/300`,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpList"] });
      setIsModalOpen(false);
    },
  });

  // ----------------------
  // 1. 스크롤 위치 state + throttle
  // ----------------------
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 2000);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    console.log("Throttled scrollY:", throttledScrollY);
  }, [throttledScrollY]);

  // ----------------------
  // 2. IntersectionObserver 무한 스크롤
  // ----------------------
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
      {/* 검색창 */}
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value as "title" | "tag")}
        className="p-2 border rounded"
      >
        <option value="title">제목</option>
        <option value="tag">태그</option>
      </select>
      <input
        type="text"
        placeholder="검색어를 입력하세요..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-64 p-2 border rounded mb-4"
      />

      {/* 정렬 버튼 */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setSort(PAGINATION_ORDER.desc)}
          className={clsx(
            "px-4 py-2 rounded",
            sort === PAGINATION_ORDER.desc ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          )}
        >
          최신순
        </button>
        <button
          onClick={() => setSort(PAGINATION_ORDER.asc)}
          className={clsx(
            "px-4 py-2 rounded",
            sort === PAGINATION_ORDER.asc ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
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
              className="relative border rounded-lg overflow-hidden shadow bg-gray-700 animate-pulse h-48 flex flex-col justify-between p-3"
            >
              <div className="bg-gray-800 h-28 w-full rounded mb-2" />
              <div className="space-y-1">
                <div className="bg-white/30 h-4 w-3/4 rounded" />
                <div className="bg-white/30 h-3 w-1/2 rounded" />
                <div className="bg-white/30 h-3 w-1/3 rounded" />
              </div>
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
            <img src={lp.thumbnail} alt={lp.title} className="w-full h-48 object-cover" />
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
              className="relative border rounded-lg overflow-hidden shadow bg-gray-700 animate-pulse h-48 flex flex-col justify-between p-3"
            >
              <div className="bg-gray-800 h-28 w-full rounded mb-2" />
              <div className="space-y-1">
                <div className="bg-white/30 h-4 w-3/4 rounded" />
                <div className="bg-white/30 h-3 w-1/2 rounded" />
                <div className="bg-white/30 h-3 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 무한 스크롤 감지 div */}
      <div ref={observerRef} className="h-1" />

      {/* 우측 하단 + 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg transition-all duration-200"
      >
        +
      </button>

      {/* LP 추가 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(data: LPData) => createLp.mutate(data)}
        title="새로운 LP 추가"
      />
    </div>
  );
};

export default HomePage;
