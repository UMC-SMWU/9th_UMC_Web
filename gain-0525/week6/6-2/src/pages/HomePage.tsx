import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";

/**
 * [수정] LpSkeleton 컴포넌트: 카드와 동일 크기, 깜빡이는 애니메이션 적용 (요구사항 [4])
 */
const LpSkeleton = () => (
  <div className="relative border rounded-lg overflow-hidden shadow animate-pulse">
    {/* 썸네일 영역 */}
    <div className="w-full h-48 bg-gray-300"></div> 
    <div className="absolute inset-0 bg-gray-400 bg-opacity-30 opacity-100 flex flex-col justify-end p-4">
      {/* 제목 영역 */}
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
      {/* 업로드/좋아요 영역 */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);

const HomePage = () => {
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  
  // limit은 스켈레톤 개수에도 사용되므로 변수로 관리하는 것이 좋습니다.
  const ITEMS_PER_PAGE = 300; 

  const { 
    data, 
    isLoading, // 초기 로딩
    isError,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage // 다음 페이지 로딩 중
  } = useGetLpList({ order: sort, limit: ITEMS_PER_PAGE });
  
  const navigate = useNavigate();

  const observerTargetRef = useRef<HTMLDivElement>(null); // 타입 지정

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 1.0,
    });

    const currentTarget = observerTargetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };

  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


  // [수정] 초기 로딩 시 스켈레톤 UI (상단)
  if (isLoading) {
    return (
      <div className="mt-20 px-4">
        <div className="flex space-x-2 mb-4">
          <button className="px-4 py-2 rounded bg-gray-200 text-black">최신순</button>
          <button className="px-4 py-2 rounded bg-gray-200 text-black">오래된순</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <LpSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) return <div className="mt-20 px-4">데이터를 불러오는 중 오류 발생!</div>;
  if (!data || data.length === 0) return <div className="mt-20 px-4">데이터가 없습니다.</div>;

  return (
    <div className="mt-20 px-4">
      {/* 정렬 버튼 */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setSort(PAGINATION_ORDER.desc)}
          className={`px-4 py-2 rounded ${
            sort === PAGINATION_ORDER.desc ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          최신순
        </button>
        <button
          onClick={() => setSort(PAGINATION_ORDER.asc)}
          className={`px-4 py-2 rounded ${
            sort === PAGINATION_ORDER.asc ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          오래된순
        </button>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((lp) => (
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

      {/* [수정] Intersection Observer 타겟 및 하단 로딩/마지막 페이지 표시 */}
      <div ref={observerTargetRef} className="h-10 flex justify-center items-center mt-8">
        {isFetchingNextPage ? (
          // [추가] 다음 페이지 로딩 중일 때 하단 스켈레톤 표시 (요구사항 [4])
          <LpSkeleton /> 
        ) : (
          !hasNextPage && <div className="text-gray-500">마지막 페이지입니다.</div>
        )}
      </div>
    </div>
  );
};

export default HomePage;