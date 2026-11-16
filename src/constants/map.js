// Free OpenStreetMap-based style from OpenFreeMap — no API key needed.
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

// Satellite photos show every real building, even ones OpenStreetMap hasn't
// mapped yet. ArcGIS's "imagery" style: photos plus road and place-name
// labels, using EXPO_PUBLIC_ARCGIS_API_KEY (in .env). Free for 2M tiles a
// month; with pay-as-you-go off (the default) it stops at the limit, no bill.
const ARCGIS_API_KEY = process.env.EXPO_PUBLIC_ARCGIS_API_KEY;
const ARCGIS_STYLES =
  "https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles";

// Not passed to the map directly: useSatelliteStyle downloads and fixes it up
// first. Without a key ArcGIS rejects it, and the app shows an error.
export const ARCGIS_SATELLITE_STYLE_URL = `${ARCGIS_STYLES}/arcgis/imagery?token=${encodeURIComponent(ARCGIS_API_KEY ?? "")}`;

// Credit each map must show (licence requirement). The ArcGIS labels are
// partly OpenStreetMap data, so it's credited too.
export const MAP_ATTRIBUTION = "© OpenStreetMap contributors";
export const SATELLITE_ATTRIBUTION =
  "Powered by Esri | Esri, Vantor, Earthstar Geographics, © OpenStreetMap contributors";

// [longitude, latitude] maps open on when the user's position is unknown.
export const DEFAULT_CENTER = [80.2707, 13.0827];
