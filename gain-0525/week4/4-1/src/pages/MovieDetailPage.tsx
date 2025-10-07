import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";
import type { MovieDetail, CreditsResponse } from "../types/movie";
import noImage from "../assets/no_image.jpg";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  // 영화 상세 정보 호출
  const { data: movie, isPending: isMovieLoading, isError: isMovieError } = useCustomFetch<MovieDetail>(
    movieId
      ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
      : "",
    {
      headers: { Authorization: `Bearer ${API_KEY}` },
    },
    [movieId]
  );

  // 출연진/제작진 호출
  const { data: credits, isPending: isCreditsLoading, isError: isCreditsError } = useCustomFetch<CreditsResponse>(
    movieId
      ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
      : "",
    {
      headers: { Authorization: `Bearer ${API_KEY}` },
    },
    [movieId]
  );

  const loading = isMovieLoading || isCreditsLoading;
  const error = isMovieError || isCreditsError;

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );

  if (error) return <p>❌ 데이터를 불러오는 중 오류가 발생했습니다.</p>;
  if (!movie) return <p>❌ 영화 정보를 불러올 수 없습니다.</p>;

  const cast = credits?.cast ?? [];
  const crew = credits?.crew ?? [];

  return (
    <div className="relative flex flex-col items-center text-white">
      {/* 배경 포스터 + 블러 + 그라데이션 */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: movie.poster_path
            ? `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,1) 100%), url(https://image.tmdb.org/t/p/original${movie.poster_path})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "cover",
          filter: "blur(8px)",
        }}
      ></div>

      {/* 영화 정보 + 포스터 */}
      <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center gap-8">
        {/* 영화 정보 */}
        <div className="flex-1 space-y-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-300">
            <p><strong>개봉일:</strong> {movie.release_date}</p>
            <p><strong>평점:</strong> ⭐ {movie.vote_average}</p>
            <p><strong>상영 시간:</strong> {movie.runtime}분</p>
            <p><strong>장르:</strong> {movie.genres?.map(g => g.name).join(", ")}</p>
          </div>
          <div className="mt-4 text-gray-200">
            <h2 className="text-2xl font-semibold mb-2">줄거리</h2>
            <p>{movie.overview || "등록된 줄거리가 없습니다."}</p>
          </div>
        </div>

        {/* 포스터 */}
        <div className="flex-shrink-0">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : noImage}
            alt={movie.title}
            className="w-64 md:w-80 rounded-xl shadow-2xl"
          />
        </div>
      </div>

      {/* 출연진 */}
      <div className="bg-black text-white mt-10 p-6 rounded-xl shadow-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">출연진</h2>
        <div className="flex gap-4 overflow-x-auto">
          {cast.slice(0, 10).map(actor => (
            <div key={actor.id} className="text-center flex-shrink-0 w-28">
              <img
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : noImage}
                alt={actor.name}
                className="w-full rounded-lg mb-2"
              />
              <p className="text-sm">{actor.name}</p>
              <small className="text-gray-400">({actor.character})</small>
            </div>
          ))}
        </div>
      </div>

      {/* 제작진 */}
      <div className="bg-black text-white mt-10 p-6 rounded-xl shadow-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">주요 제작진</h2>
        <div className="flex gap-4 overflow-x-auto">
          {crew
            .filter(c => ["Director", "Producer", "Writer"].includes(c.job))
            .map(member => (
              <div key={member.id} className="text-center flex-shrink-0 w-28">
                <div className="w-full h-40 rounded-lg mb-2 bg-gray-400 flex items-center justify-center overflow-hidden">
                  {member.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm">이미지 없음</span>
                  )}
                </div>
                <p className="text-sm">{member.name}</p>
                <small className="text-gray-400">{member.job}</small>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
