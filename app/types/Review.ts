type Review = {
    _id: string | null
    id: number;
    username: string;
    rating: number;
    reviewText: string;
    likes: string[];
    dislikes: string[];
    hasSpoilers: boolean;
    createdAt: Date
}
export default Review;