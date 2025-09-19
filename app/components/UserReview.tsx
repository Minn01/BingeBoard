'use client'
import { Star } from 'lucide-react';

interface UserReviewProps {
    id: string;
    initials: string;
    name: string;
    timeAgo: string;
    rating: number;
    reviewText: string;
    helpfulCount: number;
    unhelpfulCount: number;
    hasSpoiler?: boolean;
    userLiked?: boolean; 
    userDisliked?: boolean; 
    handleVote: (reviewId: string, action: "like" | "dislike") => Promise<void>;
}


function UserReview({
    id,
    initials,
    name,
    timeAgo,
    rating,
    reviewText,
    helpfulCount,
    unhelpfulCount,
    hasSpoiler = false,
    userLiked,
    userDisliked,
    handleVote,
}: UserReviewProps) {
    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-start gap-4">
                <div
                    className={`w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-semibold text-lg`}
                >
                    {initials}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-white">{name}</span>
                        <span className="text-gray-400 text-sm">{timeAgo}</span>
                        {hasSpoiler && (
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                                SPOILERS
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                            {[...Array(rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            {[...Array(10 - rating)].map((_, i) => (
                                <Star key={i + rating} className="w-4 h-4 text-gray-600" />
                            ))}
                        </div>
                        <span className="text-white font-semibold">{rating}/10</span>
                    </div>

                    <p className="text-gray-200 mb-4 leading-relaxed">{reviewText}</p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-6 text-sm">
                        <button
                            onClick={() => {
                                handleVote(id, 'like')
                            }}
                            className={`flex items-center gap-2 transition-colors ${userLiked ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                />
                            </svg>
                            <span>{helpfulCount} Helpful</span>
                        </button>
                        <button
                            onClick={() => {
                                handleVote(id, 'dislike')
                            }}
                            className={`flex items-center gap-2 transition-colors ${userDisliked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c-.5 0-.905-.405-.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M17 4H19a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                                />
                            </svg>
                            <span>{unhelpfulCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserReview;