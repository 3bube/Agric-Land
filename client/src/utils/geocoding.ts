interface Coordinates {
  lat: number;
  lng: number;
}

export async function getCoordinatesFromLocation(location: string): Promise<Coordinates | null> {
  try {
    // Append ", Nigeria" to make the search more specific
    const searchQuery = `${location}, Nigeria`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery
      )}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Error geocoding location:", error);
    return null;
  }
}
