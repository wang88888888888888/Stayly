// src/pages/CreateReviewPage.jsx
import React, { useState } from "react";

const CreateReviewPage = () => {
    const [formData, setFormData] = useState({ title: "", content: "", rating: "", address: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            setError("You must be logged in to add a review.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess("Review added successfully!");
                setError("");
                // Reset the form fields after successful submission
                setFormData({ title: "", content: "", rating: "", address: "" });
            } else {
                const data = await response.json();
                setError(data.error || "Failed to add review.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Add a Review</h1>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 p-2 w-full border rounded"
                            placeholder="Enter review title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="mt-1 p-2 w-full border rounded"
                            placeholder="Enter review content"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <input
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                            className="mt-1 p-2 w-full border rounded"
                            placeholder="Rating (1-5)"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="mt-1 p-2 w-full border rounded"
                            placeholder="Enter address"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateReviewPage;
