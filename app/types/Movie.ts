// types/Movie.ts
type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
    overview: string;
    userStatus?: 'watched' | 'watching' | 'want_to_watch';
    userRating?: number | null;
    episodesWatched?: number;
    totalEpisodes?: number;
};

export default Movie;
