// HomePage.jsx is a functional component that displays the main content of the application. 
// It consists of a search bar, an address panel, and a map. 
// The component fetches grouped reviews by address and allows users to search for addresses. 
// The search results are displayed in the address panel and on the map. 
// The component uses the useState and useEffect hooks to manage state and perform side effects.
import React, { useState, useEffect } from "react";
import Map from "../components/Map/Map";
import AddressPanel from "../components/Address/AddressPanel";
import SearchBar from "../components/Search/SearchBar";

const HomePage = () => {
    const [addresses, setAddresses] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 49.2827, lng: -123.1207 });
    const [isPanelOpen, setIsPanelOpen] = useState(false); // State for panel visibility

    // Fetch grouped reviews by address
    const fetchAddresses = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/reviews/grouped-by-address");
            const data = await response.json();
            setAddresses(data);
        } catch (error) {
            console.error("Error fetching grouped addresses:", error);
        }
    };

    // Refetch grouped addresses (used after adding a new review)
    const refetchAddresses = async () => {
        await fetchAddresses();
    };

    // Perform initial data fetch
    useEffect(() => {
        fetchAddresses();
    }, []);

    // Handle search functionality
    const handleSearch = async (query) => {
        try {
            const endpoint = query
                ? `http://localhost:8000/api/addresses/search?query=${query}`
                : "http://localhost:8000/api/reviews/grouped-by-address";

            const response = await fetch(endpoint);
            const results = await response.json();

            if (results.length > 0) {
                setAddresses(results);
                setMapCenter({
                    lat: results[0].latitude,
                    lng: results[0].longitude,
                });
            } else {
                setAddresses([]);
            }
        } catch (error) {
            console.error("Error performing search:", error);
        }
    };

    return (
        <div className="relative h-screen bg-gray-100">
            {/* Toggle Button for Mobile */}
            <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 md:hidden"
            >
                {isPanelOpen ? "Show Map" : "Open Reviews"}
            </button>

            <div className="flex h-full">
                {/* Address Panel */}
                <div
                    className={`${isPanelOpen ? "absolute w-full h-full" : "hidden"
                        } md:relative md:block md:w-1/4 md:h-full bg-white shadow-lg overflow-y-auto z-40`}
                >
                    <div className="p-4">
                        <SearchBar onSearch={handleSearch} />
                        <AddressPanel addresses={addresses} onReviewCreated={refetchAddresses} />
                    </div>
                </div>

                {/* Map */}
                {!isPanelOpen && (
                    <div className="w-full md:w-3/4 h-full">
                        <Map center={mapCenter} markers={addresses} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;