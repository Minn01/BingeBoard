import Movie from './Movie'

type InitialData = {
  trending: Movie[];
  popularMovies: Movie[];
  popularTVShows: Movie[];
  totalPages: {
    trending: number;
    movies: number;
    tv: number;
  };
};

export default InitialData;