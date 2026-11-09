// OpenRouteService: OpenStreetMap-based routing. Free plan, needs an API key
// (EXPO_PUBLIC_ORS_API_KEY in .env.local). The key ships inside the app, so
// move these calls behind our own backend before release.
const ORS_URL = "https://api.openrouteservice.org/v2/directions";
const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY;

// Route between two [lng, lat] points. `profile` is an ORS profile:
// "driving-car", "cycling-regular", "foot-walking", ...
// Resolves to { geometry, bounds, distance (m), duration (s) }, or throws.
export async function fetchRoute(start, end, profile = "driving-car") {
  const params = new URLSearchParams({
    start: `${start[0]},${start[1]}`,
    end: `${end[0]},${end[1]}`,
  });
  const response = await fetch(`${ORS_URL}/${profile}?${params}`, {
    headers: { Authorization: ORS_API_KEY },
  });
  const data = await response.json();
  // Errors come back as { error: { code, message } } with a non-200 status.
  if (!response.ok || !data.features?.length) {
    throw new Error(data.error?.message ?? "No route found");
  }

  const route = data.features[0];
  return {
    geometry: route.geometry, // GeoJSON LineString
    bounds: data.bbox, // [west, south, east, north] — ORS works it out for us
    distance: route.properties.summary.distance,
    duration: route.properties.summary.duration,
  };
}
