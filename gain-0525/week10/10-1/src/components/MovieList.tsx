import type { ReactElement } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
    movies: Movie[];
    onClickMovie?: (movie: Movie) => void;
}

const MovieList = ({ movies, onClickMovie }: MovieListProps): ReactElement => {
    if (movies.length === 0) {
        return (
            <div className="flex h-60 items-center justify-center">
                <p className="font-bold text-gray-500">검색 결과가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id} // 반복 최상위 요소에만 key 필요
                    movie={movie}
                    onClick={() => onClickMovie?.(movie)} // MovieCard 내부로 클릭 전달
                />
            ))}
        </div>
    );
};

export default MovieList;
