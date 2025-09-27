// app/browse/page.tsx
import BrowseClient from '../components/BrowseClient';
import { tmdbApi, tmdbToMovie } from '@/lib/tmdb';
import { Suspense } from 'react';
import PageLoader from '../components/PageLoader'; // your fallback component

export default async function BrowsePage() {
  let initialData;

  try {
    const [trendingRes, popularMoviesRes, popularTVRes] = await Promise.all([
      tmdbApi.getTrending('week', 1),
      tmdbApi.getPopularMovies(1),
      tmdbApi.getPopularTVShows(1)
    ]);

    initialData = {
      trending: trendingRes.results.slice(0, 20).map(tmdbToMovie),
      popularMovies: popularMoviesRes.results.slice(0, 20).map(tmdbToMovie),
      popularTVShows: popularTVRes.results.slice(0, 20).map(tmdbToMovie),
      totalPages: {
        trending: trendingRes.total_pages,
        movies: popularMoviesRes.total_pages,
        tv: popularTVRes.total_pages
      }
    };
  } catch (err) {
    console.error('Failed to load browse data:', err);
    // You could handle fallback UI here if you want
    initialData = {
      trending: [],
      popularMovies: [],
      popularTVShows: [],
      totalPages: { trending: 1, movies: 1, tv: 1 }
    };
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <BrowseClient initialData={initialData} />
    </Suspense>
  );
}
