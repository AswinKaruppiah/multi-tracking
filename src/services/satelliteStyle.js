import { ARCGIS_SATELLITE_STYLE_URL } from "@/constants/map";
import { colors } from "@/styles/theme";

// ArcGIS styles give each source both a ready `tiles` list and a `url` to an
// ArcGIS server. Native MapLibre follows the `url`, gets ArcGIS's own format
// instead of TileJSON, and fails with "source must have tiles". Dropping the
// `url` makes it use the `tiles` list.
//
// The style also has no background layer, so the map is black until the
// photos arrive. A gray background (app colour) shows instead.
function fixStyle(style) {
  const sources = Object.fromEntries(
    Object.entries(style.sources).map(([id, { url, ...source }]) => [
      id,
      source,
    ]),
  );
  const background = {
    id: "background",
    type: "background",
    paint: { "background-color": colors.brand.gray },
  };
  return { ...style, sources, layers: [background, ...style.layers] };
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
      loadedStyle = fixStyle(body);
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
