'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Movie from '../types/Movie';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
    title: string;
    movies: Movie[];
    autoplay?: boolean;
    showPagination?: boolean;
    slidesPerView?: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
}

function MovieCarousel({ 
    title, 
    movies, 
    autoplay = false,
    showPagination = false,
    slidesPerView = { mobile: 1.2, tablet: 3, desktop: 5 }
}: MovieCarouselProps) {
    // Generate unique IDs for navigation buttons
    const carouselId = `carousel-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    
    if (!movies || movies.length === 0) {
        return null;
    }

    return (
        <div className="mb-8 w-full">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 px-4">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <div className="flex space-x-2">
                    <button
                        className={`${carouselId}-prev p-2 rounded-full bg-white/90 hover:bg-white border border-gray-200 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10`}
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                        className={`${carouselId}-next p-2 rounded-full bg-white/90 hover:bg-white border border-gray-200 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10`}
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Swiper Carousel - Fixed container */}
            <div className="w-full overflow-hidden px-4">
                <Swiper
                    modules={[Navigation, Pagination, ...(autoplay ? [Autoplay] : [])]}
                    spaceBetween={16}
                    slidesPerView={slidesPerView.mobile}
                    breakpoints={{
                        640: {
                            slidesPerView: slidesPerView.tablet,
                            spaceBetween: 16,
                        },
                        1024: {
                            slidesPerView: slidesPerView.desktop,
                            spaceBetween: 20,
                        },
                    }}
                    navigation={{
                        nextEl: `.${carouselId}-next`,
                        prevEl: `.${carouselId}-prev`,
                    }}
                    pagination={showPagination ? {
                        clickable: true,
                        dynamicBullets: true,
                    } : false}
                    autoplay={autoplay ? {
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    } : false}
                    loop={movies.length > slidesPerView.desktop}
                    grabCursor={true}
                    className="carousel-swiper !w-full"
                    style={{ width: '100%' }}
                >
                    {movies.map((movie) => (
                        <SwiperSlide key={movie.id} className="!w-auto">
                            <div className="h-full transition-transform duration-300 hover:scale-105">
                                <MovieCard 
                                    movie={movie} 
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Pagination (if enabled) */}
                {showPagination && (
                    <div className="flex justify-center mt-4">
                        <div className="swiper-pagination"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieCarousel;