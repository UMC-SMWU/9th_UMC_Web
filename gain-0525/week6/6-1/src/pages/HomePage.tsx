import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";

const HomePage = () => {
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const { data, isPending, isError } = useGetLpList({ order: sort });
  const navigate = useNavigate();

  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>데이터를 불러오는 중 오류 발생!</div>;
  if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;

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
            {/* 썸네일 */}
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-48 object-cover"
            />

            {/* Hover 오버레이 */}
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
    </div>
  );
};

export default HomePage;
