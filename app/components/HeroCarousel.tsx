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

interface HeroCarouselProps {
    movies: Movie[];
    onViewDetails: (movie: Movie) => void;
    onPlayMovie?: (movie: Movie) => void;
    onAddToList?: (movie: Movie) => void;
}

function HeroCarousel({ 
    movies, 
    onViewDetails, 
    onPlayMovie, 
    onAddToList 
}: HeroCarouselProps) {
    
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
                        <div className="relative w-full h-full">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={movie.poster_path 
                                        ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}` 
                                        : '/api/placeholder/1280/720'
                                    }
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Dark overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="max-w-2xl">
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
                                            <span className="text-white/60 text-lg">•</span>
                                            <span className="text-white/80 text-lg">Movie</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-white/90 text-lg md:text-xl mb-8 drop-shadow line-clamp-3 leading-relaxed">
                                            {movie.overview}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                onClick={() => onPlayMovie?.(movie)}
                                                className="flex items-center bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                            >
                                                <Play className="w-6 h-6 mr-2 fill-current" />
                                                Play
                                            </button>
                                            
                                            <button
                                                onClick={() => onViewDetails(movie)}
                                                className="flex items-center bg-gray-600/80 hover:bg-gray-600 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 border border-white/20 hover:border-white/40"
                                            >
                                                <Info className="w-6 h-6 mr-2" />
                                                More Info
                                            </button>
                                            
                                            <button
                                                onClick={() => onAddToList?.(movie)}
                                                className="flex items-center bg-transparent hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 border-2 border-white/60 hover:border-white"
                                            >
                                                <Plus className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button className="hero-button-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 group">
                <svg className="w-6 h-6 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <button className="hero-button-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 group">
                <svg className="w-6 h-6 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Custom Pagination Dots */}
            <div className="hero-pagination absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2"></div>
        </div>
    );
}

export default HeroCarousel;