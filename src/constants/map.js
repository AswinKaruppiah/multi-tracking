// Free OpenStreetMap-based style from OpenFreeMap — no API key needed.
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

// Satellite photos show every real building, even ones OpenStreetMap hasn't
// mapped yet. Esri's free tiles (no key) with road and place-name labels on
// top. Before release, add a free ArcGIS Location Platform key, since keyless
// Esri tiles are meant for development.
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const esriSource = (service, maxzoom = 19) => ({
  type: "raster",
  tiles: [`${ESRI}/${service}/MapServer/tile/{z}/{y}/{x}`],
  tileSize: 256,
  maxzoom,
});

export const SATELLITE_STYLE = {
  version: 8,
  sources: {
    // Zoom 18 max: outside city centres Esri has no deeper photos and sends a
    // gray "no data" tile. Past 18 the map enlarges the zoom-18 photo instead.
    imagery: esriSource("World_Imagery", 18),
    roads: esriSource("Reference/World_Transportation"),
    places: esriSource("Reference/World_Boundaries_and_Places"),
  },
  layers: [
    { id: "imagery", type: "raster", source: "imagery" },
    { id: "roads", type: "raster", source: "roads" },
    { id: "places", type: "raster", source: "places" },
  ],
};

// Credit each map must show (licence requirement).
export const MAP_ATTRIBUTION = "© OpenStreetMap contributors";
export const SATELLITE_ATTRIBUTION = "Esri, Maxar, Earthstar Geographics";

// [longitude, latitude] maps open on when the user's position is unknown.
export const DEFAULT_CENTER = [80.2707, 13.0827];
