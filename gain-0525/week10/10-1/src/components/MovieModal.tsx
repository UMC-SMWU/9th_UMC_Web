import { type Movie } from "../types/movie";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackPoster = "https://via.placeholder.com/300x450";

  const posterUrl = movie.poster_path ? posterBaseUrl + movie.poster_path : fallbackPoster;

  return (
    // 1. 모달 전체 배경: 배경을 완전 투명하게 변경 (bg-transparent).
    // 모달을 중앙에 띄우기 위해 flex 설정은 유지합니다.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      
      {/* 2. 모달 창: 배경을 흰색(bg-white)으로 변경하고 둥근 모서리 및 그림자 추가. */}
      {/* 캡처 디자인처럼 상단에 붙이는 대신 다시 중앙에 띄우겠습니다. */}
      <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl overflow-hidden p-6"> 
        
        {/* 3. 닫기 버튼: 모달 창 내부의 오른쪽 상단에 위치. 
           (배경이 흰색이므로 텍스트 색상을 검은색/회색으로 변경합니다.) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-gray-700 text-3xl font-light opacity-90 hover:text-black transition"
        >
          ×
        </button>

        {/* 4. 제목 영역 */}
        <div className="mb-6">
             {/* 제목 텍스트 색상을 검은색(text-gray-900)으로 변경 */}
             <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
               {movie.title}
             </h2>
             
             {/* 개봉일 및 평점: 정보를 위해 다시 추가 (흰색 모달 배경에 맞게 회색/파란색 사용) */}
             <p className="mt-2 text-base font-semibold text-gray-600">
                개봉일: <span className="font-normal">{movie.release_date}</span> | 
                평점: <span className="text-blue-600 font-bold">{movie.vote_average.toFixed(1)}</span> / 10
             </p>
        </div>


        {/* 5. 포스터 + 줄거리 + 버튼 영역 */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* 6. 포스터 */}
          <img
            src={posterUrl}
            alt={movie.title + " 포스터"}
            className="w-48 h-auto object-cover rounded-lg shadow-md flex-shrink-0"
          />

          {/* 7. 정보 영역 */}
          <div className="flex-1"> 
            
            {/* 줄거리 제목 색상 */}
            <h3 className="mb-2 text-xl font-bold text-gray-900">줄거리</h3>
            {/* 줄거리 텍스트 색상 */}
            <p className="text-gray-700 text-sm leading-relaxed max-h-40 overflow-y-auto pr-2">
              {movie.overview}
            </p>
            
            {/* 버튼 영역 */}
            <div className="mt-6 flex gap-3">
              <a
                href={`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-semibold"
              >
                IMDb에서 검색
              </a>
              <button
                onClick={onClose}
                className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition font-semibold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;