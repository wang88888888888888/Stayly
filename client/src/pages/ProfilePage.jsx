import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReviewList from "../components/Review/ReviewList";

const ProfilePage = () => {
    const [user, setUser] = useState(null); // Store user profile data
    const [loading, setLoading] = useState(true); // Handle loading
    const navigate = useNavigate();

    // Fetch the user's profile
    const fetchProfile = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login"); // Redirect to login if no token exists
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else if (response.status === 401) {
                navigate("/login"); // Redirect to login if unauthorized
            } else {
                console.error("Failed to fetch profile");
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch the profile whenever a review is updated or added
    const refetchProfile = async () => {
        await fetchProfile(); // Re-fetch the profile data from the server
    };

    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    // Update a review
    const handleUpdateReview = async (reviewId, updatedReview) => {
        try {
            // Log the payload to debug
            // console.log("Updating Review - ID:", reviewId);
            // console.log("Payload Sent:", updatedReview);

            // Make the API call to update the review
            const response = await fetch(`http://localhost:8000/api/reviews/${reviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(updatedReview),
            });

            if (response.ok) {
                // Parse the response JSON
                const updated = await response.json();
                // console.log("Updated review response from API:", updated);

                // Re-fetch the user profile to reflect changes in the UI
                await refetchProfile();

                // Alert the user with the updated information
                const updatedAddress = updated?.address?.address || updatedReview.address || "N/A";
                setTimeout(() => {
                    alert(`Your review at "${updatedAddress}" has been successfully updated.`);
                }, 100);
            } else {
                // Log the error details for failed API calls
                const errorText = await response.text();
                console.error("Failed to update review. Response Status:", response.status);
                console.error("Error Text:", errorText || "No error details provided");
            }
        } catch (err) {
            // Log unexpected errors
            console.error("Error updating review:", err.message);
        }
    };




    // Delete a review
    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/reviews/${reviewId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (response.ok) {
                // Re-fetch the profile to get updated data
                await refetchProfile();

                setTimeout(() => {
                    alert("Your review has been deleted.");
                }, 100);
            } else {
                console.error("Failed to delete review");
            }
        } catch (err) {
            console.error("Error deleting review:", err);
        }
    };

    if (loading) return <p className="text-center text-gray-700">Loading...</p>;
    if (!user) return null; // Ensure the component doesn't break

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white p-6 rounded shadow-lg">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Welcome, {user.name}</h1>
                <p className="text-sm sm:text-base text-gray-700 text-center">Email: {user.email}</p>

                <h2 className="text-lg sm:text-xl font-semibold mt-6 mb-4 text-center">Your Reviews:</h2>
                <ReviewList
                    reviews={user.reviews}
                    onUpdateReview={handleUpdateReview}
                    onDeleteReview={handleDeleteReview}
                    renderAddress={(review) => (
                        <p className="text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Address: {review.address?.address || "N/A"}
                        </p>
                    )}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
