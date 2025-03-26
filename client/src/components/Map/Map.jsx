import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// Map.jsx
// This component displays a Google Map with markers for the provided addresses.

/**
 * Google Map Component.
 * Props:
 * - `center`: Coordinates to center the map.
 * - `markers`: Array of markers (apartments) with latitude and longitude.
 */

const Map = ({ center, markers }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Google Maps API Key

    });

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div className="w-full h-full">
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                zoom={12}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={{ lat: marker.latitude, lng: marker.longitude }}
                        title={marker.address}
                    />
                ))}
            </GoogleMap>
        </div>
    );
};

export default Map;
