import React from "react";
import ReviewCard from "./ReviewCard";

// ReviewList displays a list of reviews and handles actions through props.
const ReviewList = ({ reviews, onUpdateReview, onDeleteReview }) => {
    if (!reviews || reviews.length === 0) {
        return <p className="text-sm text-gray-500">You have not written any reviews yet.</p>;
    }

    return (
        <div className="space-y-4 overflow-y-auto max-h-[75vh] px-4 sm:px-6 md:px-8">
            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    onUpdateReview={onUpdateReview}
                    onDeleteReview={onDeleteReview}
                />
            ))}
        </div>
    );
};

export default ReviewList;
