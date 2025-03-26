import React, { useState } from "react";

// ReviewCard displays a single review and provides edit and delete functionality.
const ReviewCard = ({ review, onUpdateReview, onDeleteReview }) => {
    const [isEditing, setIsEditing] = useState(false); // Edit mode state.
    const [editedReview, setEditedReview] = useState({
        address: review.address?.address || "", // Explicitly access the address string
        title: review.title,
        content: review.content,
        rating: review.rating,
    }); // Local state for editing a review.

    const handleSave = () => {
        onUpdateReview(review.id, editedReview); // Trigger update handler from props.
        setIsEditing(false); // Exit edit mode.
    };

    return (
        <div className="p-4 border rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-start">
            {isEditing ? (
                <div className="flex-1">
                    {/* Editable Address */}
                    <input
                        type="text"
                        className="border rounded w-full mb-2 p-2 text-sm sm:text-base"
                        value={editedReview.address}
                        onChange={(e) =>
                            setEditedReview({ ...editedReview, address: e.target.value })
                        }
                        placeholder="Address"
                    />
                    {/* Editable Title */}
                    <input
                        type="text"
                        className="border rounded w-full mb-2 p-2 text-sm sm:text-base"
                        value={editedReview.title}
                        onChange={(e) =>
                            setEditedReview({ ...editedReview, title: e.target.value })
                        }
                        placeholder="Title"
                    />
                    {/* Editable Content */}
                    <textarea
                        className="border rounded w-full mb-2 p-2 text-sm sm:text-base"
                        value={editedReview.content}
                        onChange={(e) =>
                            setEditedReview({ ...editedReview, content: e.target.value })
                        }
                        placeholder="Content"
                    ></textarea>
                    {/* Editable Rating */}
                    <input
                        type="number"
                        className="border rounded w-full mb-2 p-2 text-sm sm:text-base"
                        value={editedReview.rating}
                        onChange={(e) =>
                            setEditedReview({ ...editedReview, rating: parseInt(e.target.value) })
                        }
                        placeholder="Rating"
                    />
                    <div className="flex space-x-2">
                        <button
                            className="bg-blue-500 text-white text-xs sm:text-sm px-4 py-2 rounded w-full sm:w-auto"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            className="bg-gray-500 text-white text-xs sm:text-sm px-4 py-2 rounded w-full sm:w-auto"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1">
                    {/* Correctly Rendered Address */}
                    <p className="text-sm sm:text-base text-gray-700 font-semibold mb-2">
                        Address: {review.address?.address || "N/A"} {/* Fix */}
                    </p>
                    {/* Title */}
                    <h3 className="text-sm sm:text-lg font-bold">{review.title}</h3>
                    {/* Content */}
                    <p className="text-xs sm:text-base">{review.content}</p>
                    {/* Rating */}
                    <p className="text-xs sm:text-sm text-gray-500">Rating: {review.rating}/5</p>
                    <div className="mt-2 sm:mt-4 flex space-x-2">
                        <button
                            className="bg-gray-500 text-white text-xs sm:text-sm px-4 py-2 rounded w-full sm:w-auto"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-gray-500 text-white text-xs sm:text-sm px-4 py-2 rounded w-full sm:w-auto"
                            onClick={() => onDeleteReview(review.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewCard;
