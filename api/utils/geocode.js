const { Client } = require("@googlemaps/google-maps-services-js");

const googleMapsClient = new Client({});

/**
 * Geocodes an address to retrieve latitude and longitude.
 * @param {string} address - The address to geocode.
 * @returns {Object} - Returns an object { lat, lng } if successful, otherwise null.
 * @throws {Error} - Throws an error if the geocoding request fails.
 */
exports.geocodeAddress = async (address) => {
  try {
    const response = await googleMapsClient.geocode({
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.results.length > 0) {
      return response.data.results[0].geometry.location; // Return { lat, lng }
    }
    return null;
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};
