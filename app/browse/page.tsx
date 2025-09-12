// app/browse/page.tsx (Server Component)
import { tmdbApi, tmdbToMovie } from "@/lib/tmdb";
import BrowseClient from '../components/BrowseClient';

async function BrowsePage() {
  try {
    // Fetch initial data on server - popular content for each type
    const [
      trendingResponse,
      popularMoviesResponse, 
      popularTVResponse
    ] = await Promise.all([
      tmdbApi.getTrending('week', 1),
      tmdbApi.getPopularMovies(1),
      tmdbApi.getPopularTVShows(1)
    ]);

    const initialData = {
      trending: trendingResponse.results.slice(0, 20).map(tmdbToMovie),
      popularMovies: popularMoviesResponse.results.slice(0, 20).map(tmdbToMovie),
      popularTVShows: popularTVResponse.results.slice(0, 20).map(tmdbToMovie),
      totalPages: {
        trending: trendingResponse.total_pages,
        movies: popularMoviesResponse.total_pages,
        tv: popularTVResponse.total_pages
      }
    };

    return <BrowseClient initialData={initialData} />;
    
  } catch (error) {
    console.error('Failed to load browse data:', error);
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold">Unable to load browse content</h3>
          <p className="text-red-600 mt-2">
            Please check your TMDB API key or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}

export default BrowsePage;