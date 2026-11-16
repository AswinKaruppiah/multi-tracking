import { ARCGIS_SATELLITE_STYLE_URL } from "@/constants/map";

// ArcGIS styles give each source both a ready `tiles` list and a `url` to an
// ArcGIS server. Native MapLibre follows the `url`, gets ArcGIS's own format
// instead of TileJSON, and fails with "source must have tiles". Dropping the
// `url` makes it use the `tiles` list.
function fixSources(style) {
  const sources = Object.fromEntries(
    Object.entries(style.sources).map(([id, { url, ...source }]) => [
      id,
      source,
    ]),
  );
  return { ...style, sources };
}

// One shared download per app run: started at app launch (root layout), so
// it's usually done before the trip screen opens. The style file is free;
// only map tiles count toward the ArcGIS quota.
let stylePromise = null;
let loadedStyle = null;

export function loadSatelliteStyle() {
  stylePromise ??= fetch(ARCGIS_SATELLITE_STYLE_URL)
    .then((res) => res.json())
    .then((body) => {
      // A bad key comes back as { error: ... } with no sources.
      if (!body.sources) throw new Error("No ArcGIS style");
      loadedStyle = fixSources(body);
      return loadedStyle;
    })
    .catch((error) => {
      stylePromise = null; // The next call tries again.
      throw error;
    });
  return stylePromise;
}

// The style if it has already downloaded, else null.
export const getLoadedSatelliteStyle = () => loadedStyle;
