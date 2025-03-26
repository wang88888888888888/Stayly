//AddressPanel.jsx displays a list of AddressCard components

import React from "react";
import AddressCard from "./AddressCard";

const AddressPanel = ({ addresses }) => {
    return (
        <div className="p-4 space-y-4 bg-gray-100 h-full overflow-y-auto">
            {/* Address Cards */}
            {addresses.map((address) => (
                <AddressCard
                    key={address.id}
                    title={address.address}
                    description={address.reviews?.length
                        ? `Reviews: ${address.reviews.length}`
                        : "No reviews available"}
                    reviews={address.reviews}
                />
            ))}
        </div>
    );
};

export default AddressPanel;
