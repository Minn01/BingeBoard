import { tmdbApi, tmdbToMovie } from "@/lib/tmdb";
import HomeClient from "./components/HomeClient";

async function Home() {
  try {
    const [
      trendingResponse,
      moviesResponse,
      tvResponse,
      topRatedResponse,
      upcomingResponse,
    ] = await Promise.all([
      tmdbApi.getTrending("week", 1),
      tmdbApi.getPopularMovies(1),
      tmdbApi.getPopularTVShows(1),
      tmdbApi.fetchFromTMDB("/movie/top_rated?page=1"),
      tmdbApi.fetchFromTMDB("/movie/upcoming?page=1"),
    ]);

    return (
      <HomeClient
        trending={trendingResponse.results.slice(0, 20).map(tmdbToMovie)}
        popularMovies={moviesResponse.results.slice(0, 20).map(tmdbToMovie)}
        popularTvShows={tvResponse.results.slice(0, 20).map(tmdbToMovie)}
        topRated={topRatedResponse.results.slice(0, 20).map(tmdbToMovie)}
        upcoming={upcomingResponse.results.slice(0, 20).map(tmdbToMovie)}
      />
    );
  } catch (err) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold">Unable to load content</h3>
          <p className="text-red-600 mt-2">
            Please check your TMDB API key or try again later.
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
