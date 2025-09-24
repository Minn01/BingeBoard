type Movie = {
    id: number;
    mediaType: string,
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
    overview: string;
    userStatus?: 'watched' | 'watching' | 'want_to_watch' | 'dropped';
    userRating?: number | null;
    episodesWatched?: number;
    totalEpisodes?: number;
    totalSeasons?: number
};

export default Movie;
