// AddressCard.jsx is a child component of AddressPanel.jsx. 
import React from "react";

const AddressCard = ({ title, description, reviews }) => {
    return (
        <div className="border p-4 rounded shadow-lg bg-white">
            {/* Title */}
            <h2 className="font-bold text-sm sm:text-base md:text-lg">{title}</h2>
            <p className="text-xs sm:text-sm text-gray-500">{description}</p>

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
                <ul className="mt-2 space-y-1 max-h-24 sm:max-h-32 overflow-y-auto">
                    {reviews.map((review) => (
                        <li key={review.id} className="text-xs sm:text-sm text-gray-700">
                            "{review.content}"
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressCard;

