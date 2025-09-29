'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Play, Plus, Info, Star } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import Movie from '../types/Movie';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type HeroCarouselProps = {
    movies: Movie[];
    onAddToList?: (movie: Movie) => void;
}

function HeroCarousel({
    movies,
    onAddToList
}: HeroCarouselProps) {
    const router = useRouter();

    const handleViewDetail = (movie: Movie) => {
        router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/details/${movie.mediaType}/${movie.id}`)
    }

    useEffect(() => {
        console.log('HeroCarousel mounted');
    }, []);

    if (!movies || movies.length === 0) {
        return null;
    }

    const featuredMovies = movies.slice(0, 8); // Show top 8 movies in hero

    return (
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] mb-12 overflow-hidden">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                effect="fade"
                navigation={{
                    nextEl: '.hero-button-next',
                    prevEl: '.hero-button-prev',
                }}
                pagination={{
                    el: '.hero-pagination',
                    clickable: true,
                    bulletClass: 'hero-pagination-bullet',
                    bulletActiveClass: 'hero-pagination-bullet-active',
                }}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                loop={true}
                className="hero-swiper h-full"
            >
                {featuredMovies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <div className="relative w-full h-full bg-black">
                            {/* Background Image (Backdrop) */}
                            <div className="absolute inset-0 bg-black">
                                <img
                                    src={movie.poster_path
                                        ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}`
                                        : '/api/placeholder/1280/720'
                                    }
                                    alt={movie.title}
                                    className="w-full h-full object-cover blur-[2px] scale-110"
                                />
                                {/* Multiple overlay gradients for better separation */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10"></div>
                                <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent"></div>

                                {/* Additional blur overlay */}
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                            </div>

                            {/* Content Container */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                                        {/* Left side - Movie Info */}
                                        <div className="flex-1 max-w-2xl pr-8">
                                            {/* Movie Title */}
                                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                                                {movie.title}
                                            </h1>

                                            {/* Rating and Year */}
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="flex items-center bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                                    <Star className="w-4 h-4 fill-white text-white mr-1" />
                                                    <span className="text-white font-semibold text-sm">
                                                        {movie.vote_average.toFixed(1)}
                                                    </span>
                                                </div>
                                                <span className="text-white/80 text-lg font-medium">
                                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                                </span>
                                                <span className="text-white/80 text-lg font-medium">
                                                    Movie
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <p className="text-white/90 text-lg mb-8 leading-relaxed line-clamp-3 max-w-xl">
                                                {movie.overview}
                                            </p>

                                            {/* Action Buttons */}
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => handleViewDetail(movie)}
                                                    className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
                                                >
                                                    <Info className="w-5 h-5" />
                                                    <span>View Details</span>
                                                </button>

                                                <button
                                                    onClick={() => onAddToList?.(movie)}
                                                    className="bg-transparent border-2 border-white/70 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center space-x-2"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                    <span>Add to favorites</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Right side - Movie Poster */}
                                        <div className="hidden lg:block flex-shrink-0">
                                            <div className="relative">
                                                <img
                                                    src={movie.poster_path
                                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                        : '/api/placeholder/300/450'
                                                    }
                                                    alt={movie.title}
                                                    className="w-64 h-96 object-cover rounded-lg shadow-2xl border-4 border-white/20"
                                                />
                                                {/* Glow effect */}
                                                <div className="absolute inset-0 rounded-lg shadow-2xl ring-1 ring-white/30"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="hero-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button className="hero-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Pagination */}
            <div className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2"></div>

            <style jsx global>{`
                .hero-pagination-bullet {
                    width: 12px;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .hero-pagination-bullet-active {
                    background: white;
                    transform: scale(1.2);
                }
                
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}

export default HeroCarousel;