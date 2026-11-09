import { GeoJSONSource, Layer } from "@maplibre/maplibre-react-native";
import { memo } from "react";

// The route drawn as a blue line with a darker outline, like Google Maps.
// `geometry` is a GeoJSON LineString from the routing service.
function RouteLine({ geometry }) {
  return (
    <GeoJSONSource id="route" data={geometry}>
      <Layer
        id="route-outline"
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{ "line-color": "#1D4ED8", "line-width": 9 }}
      />
      <Layer
        id="route-line"
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{ "line-color": "#3B82F6", "line-width": 6 }}
      />
    </GeoJSONSource>
  );
}

export default memo(RouteLine);
