// OpenRouteService: OpenStreetMap-based routing. Free plan, needs an API key
// (EXPO_PUBLIC_ORS_API_KEY in .env.local). The key ships inside the app, so
// move these calls behind our own backend before release.
// api.heigit.org replaces the deprecated api.openrouteservice.org, and only
// it gives the key its full quota (2000/day; the old domain allows 200).
const ORS_URL = "https://api.heigit.org/openrouteservice/v2/directions";
const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY;

// The main route plus at most one alternative that shares no more than 60%
// of its road with it — so the two are never the same road. (With 3, the two
// alternatives could be almost identical to each other: ORS only compares
// each with the main route.) ORS allows this only for routes under 100 km.
const ALTERNATIVES = { target_count: 2, share_factor: 0.6, weight_factor: 1.6 };
// ORS's error code for "too long for alternative routes".
const TOO_LONG_FOR_ALTERNATIVES = 2004;

async function request(profile, body) {
  const response = await fetch(`${ORS_URL}/${profile}/geojson`, {
    method: "POST",
    headers: { Authorization: ORS_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: response.ok, data: await response.json() };
}

// Routes between two [lng, lat] points. `profile` is an ORS profile:
// "driving-car", "cycling-regular", "foot-walking", ...
// Resolves to { routes, bounds }, or throws. The first route is ORS's best;
// each is { geometry, distance (m), duration (s) }. `bounds` covers them all.
export async function fetchRoutes(start, end, profile = "driving-car") {
  const coordinates = [start, end];
  let { ok, data } = await request(profile, {
    coordinates,
    alternative_routes: ALTERNATIVES,
  });

  // Long trip: ask again for just the one route.
  if (data.error?.code === TOO_LONG_FOR_ALTERNATIVES) {
    ({ ok, data } = await request(profile, { coordinates }));
  }

  // Errors come back as { error: { code, message } } with a non-200 status.
  if (!ok || !data.features?.length) {
    throw new Error(data.error?.message ?? "No route found");
  }

  return {
    routes: data.features.map((feature) => ({
      geometry: feature.geometry, // GeoJSON LineString
      distance: feature.properties.summary.distance,
      duration: feature.properties.summary.duration,
    })),
    bounds: data.bbox, // [west, south, east, north]
  };
}
