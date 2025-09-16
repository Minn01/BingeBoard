import React, { useState } from 'react';
import type { FC } from 'react';
import { Star } from "lucide-react"

type StarRatingProps = {
    rating: number;
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showScore?: boolean;
};

const StarRating: FC<StarRatingProps> = ({ 
    rating, 
    onRatingChange, 
    interactive = false, 
    size = 'md',
    showScore = true 
}) => {
    const [hover, setHover] = useState(0);
    
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };
    
    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    const handleStarClick = (star: number) => {
        if (interactive && onRatingChange) {
            // If clicking the same star that's already selected, clear the rating
            if (star === rating) {
                onRatingChange(0);
            } else {
                onRatingChange(star);
            }
        }
    };

    const displayRating = hover || rating;

    return (
        <div className="flex items-center">
            <div className="flex">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClasses[size]} transition-colors duration-150 ${
                            interactive ? 'cursor-pointer hover:scale-110 transform transition-transform' : ''
                        } ${
                            star <= displayRating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : interactive && hover > 0 
                                    ? 'text-yellow-200' 
                                    : 'text-gray-300'
                        }`}
                        onMouseEnter={() => interactive && setHover(star)}
                        onMouseLeave={() => interactive && setHover(0)}
                        onClick={() => handleStarClick(star)}
                    />
                ))}
            </div>
            {showScore && (
                <span className={`ml-2 ${textSizeClasses[size]} font-medium ${
                    rating > 0 ? 'text-gray-700' : 'text-gray-500'
                }`}>
                    {rating > 0 ? `${rating}/10` : 'Not rated'}
                </span>
            )}
            {interactive && hover > 0 && (
                <span className={`ml-1 ${textSizeClasses[size]} text-gray-400`}>
                    ({hover}/10)
                </span>
            )}
        </div>
    );
};

export default StarRating;