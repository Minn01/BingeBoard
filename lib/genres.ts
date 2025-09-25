// lib/constants/genres.ts or utils/genres.ts

/**
 * TMDB Genre mapping for both movies and TV shows
 * Updated from TMDB API responses
 */
export const GENRES: { [key: number]: string } = {
  // Movie genres
  28: "Action",
  12: "Adventure", 
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  
  // TV-specific genres
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics"
};

/**
* Get genre name by ID
* @param id - Genre ID from TMDB
* @returns Genre name or "Unknown Genre" if not found
*/
export const getGenreName = (id: number): string => {
  return GENRES[id] || "Unknown Genre";
};

/**
* Get multiple genre names by IDs
* @param ids - Array of genre IDs
* @returns Array of genre names
*/
export const getGenreNames = (ids: number[]): string[] => {
  return ids.map(id => getGenreName(id));
};