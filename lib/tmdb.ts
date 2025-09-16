// lib/tmdb.ts - TMDB API utilities
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// You need to get your API key from https://www.themoviedb.org/settings/api
export const TMDB_API_KEY = process.env.TMDB_API_KEY || '';

export interface TMDBMovie {
  id: number;
  title?: string; // for movies
  name?: string;  // for TV shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string; // for movies
  first_air_date?: string; // for TV shows
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult?: boolean;
  original_language: string;
  media_type?: 'movie' | 'tv' | 'person'; // Add media_type for search results
  // TV show specific
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

// Convert TMDB movie to our Movie type
// Convert TMDB movie/TV item to our Movie type
export function tmdbToMovie(tmdbItem: TMDBMovie): import('../app/types/Movie').default {
  const mediaType: 'movie' | 'tv' =
    tmdbItem.media_type === 'movie' || tmdbItem.media_type === 'tv'
      ? tmdbItem.media_type
      : tmdbItem.title || tmdbItem.release_date
        ? 'movie'
        : 'tv';

  return {
    id: tmdbItem.id,
    mediaType,
    title: tmdbItem.title || tmdbItem.name || 'Unknown Title',
    poster_path: tmdbItem.poster_path,
    release_date: tmdbItem.release_date || tmdbItem.first_air_date || '',
    vote_average: Math.round(tmdbItem.vote_average * 10) / 10,
    genre_ids: tmdbItem.genre_ids,
    overview: tmdbItem.overview,

    // User-specific fields will be undefined for API data
    userStatus: undefined,
    userRating: undefined,
    episodesWatched: undefined,
    totalEpisodes: tmdbItem.number_of_episodes,
    totalSeasons: tmdbItem.number_of_seasons
  };
}


export class TMDBApi {
  private baseUrl = TMDB_BASE_URL;
  private apiKey = TMDB_API_KEY;

  async fetchFromTMDB(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('TMDB API fetch error:', error);
      throw error;
    }
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromTMDB(`/movie/popular?page=${page}`);
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromTMDB(`/tv/popular?page=${page}`);
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromTMDB(`/trending/all/${timeWindow}?page=${page}`);
  }

  async searchMulti(query: string, page: number = 1): Promise<TMDBResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchFromTMDB(`/search/multi?query=${encodedQuery}&page=${page}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchFromTMDB(`/search/movie?query=${encodedQuery}&page=${page}`);
  }

  async searchTVShows(query: string, page: number = 1): Promise<TMDBResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchFromTMDB(`/search/tv?query=${encodedQuery}&page=${page}`);
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovie> {
    return this.fetchFromTMDB(`/movie/${movieId}`);
  }

  async getTVShowDetails(tvId: number): Promise<TMDBMovie> {
    return this.fetchFromTMDB(`/tv/${tvId}`);
  }

  async getGenres(): Promise<{ movie_genres: any[], tv_genres: any[] }> {
    const [movieGenres, tvGenres] = await Promise.all([
      this.fetchFromTMDB('/genre/movie/list'),
      this.fetchFromTMDB('/genre/tv/list')
    ]);

    return {
      movie_genres: movieGenres.genres,
      tv_genres: tvGenres.genres
    };
  }
}

export const tmdbApi = new TMDBApi();