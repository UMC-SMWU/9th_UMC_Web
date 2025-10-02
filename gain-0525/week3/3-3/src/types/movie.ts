export type Movie = { 
    adult: boolean;
    backdrop_path: string; 
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;      
    video: boolean;
    vote_average: number;
    vote_count: number;
};

export type MovieResponse = {
    page: number
    total_pages: number
    total_results: number
    results: Movie[]
};

export type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
  backdrop_path: string;
  tagline: string;
  status: string;
};

export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type Crew = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type CreditsResponse = {
  id: number;
  cast: Cast[];
  crew: Crew[];
};
