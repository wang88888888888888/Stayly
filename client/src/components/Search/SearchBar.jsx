import React, { useState } from "react";

/**
 * SearchBar component for filtering addresses.
 * Props:
 * - `onSearch`: Callback for executing a search query.
 * - `resetSearch`: Callback to reset the search and fetch all addresses.
 */

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value); // Dynamically update results as user types
    };

    return (
        <form className="mb-4">
            <input
                type="text"
                placeholder="Search for an apartment..."
                className="w-full p-2 border rounded"
                value={query}
                onChange={handleInputChange}
            />
        </form>
    );
};

export default SearchBar;
