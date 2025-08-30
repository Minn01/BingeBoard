import React, { useState } from 'react';
import type { FC } from 'react';
import { Star } from "lucide-react"

type StarRatingProps = {
    rating: number;
    onRate?: (rating: number) => void;
    interactive?: boolean;
};

const StarRating: FC<StarRatingProps> = ({ rating, onRate, interactive = false }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 cursor-pointer ${star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                    onClick={() => interactive && onRate && onRate(star)}
                />
            ))}
            <span className="ml-2 text-sm text-gray-600">{rating || 'Not rated'}</span>
        </div>
    );
};

export default StarRating