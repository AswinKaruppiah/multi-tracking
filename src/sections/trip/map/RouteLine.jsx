import { GeoJSONSource, Layer } from "@maplibre/maplibre-react-native";
import { memo } from "react";

import Show from "@/components/Show";

const LINE_LAYOUT = { "line-cap": "round", "line-join": "round" };

// The routes on the map: the chosen one in blue with a darker outline, the
// other (if ORS found one) in gray underneath, like Google Maps.
// `routes` are { geometry } from the routing service — 1 or 2 of them.
function RouteLine({ routes, selected }) {
  // We ask ORS for at most 2 routes, so there's at most one other route.
  const other = routes.find((_, index) => index !== selected);

  return (
    <>
      <GeoJSONSource id="route" data={routes[selected].geometry}>
        <Layer
          id="route-outline"
          type="line"
          layout={LINE_LAYOUT}
          paint={{ "line-color": "#1D4ED8", "line-width": 9 }}
        />
        <Layer
          id="route-line"
          type="line"
          layout={LINE_LAYOUT}
          paint={{ "line-color": "#3B82F6", "line-width": 6 }}
        />
      </GeoJSONSource>

      {/* After the blue source in code so "route-outline" already exists;
          beforeId then puts the gray line under it on the map. `?.`: Show.If
          builds its children even when false. */}
      <Show>
        <Show.If isTrue={!!other}>
          <GeoJSONSource id="route-other" data={other?.geometry}>
            <Layer
              id="route-other-line"
              type="line"
              beforeId="route-outline"
              layout={LINE_LAYOUT}
              paint={{ "line-color": "#9CA3AF", "line-width": 6 }}
            />
          </GeoJSONSource>
        </Show.If>
      </Show>
    </>
  );
}

export default memo(RouteLine);
