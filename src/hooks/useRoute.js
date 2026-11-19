import { useCallback, useState } from "react";

import { fetchRoutes } from "@/services/routing";

// Road routes to `destination` for the travel `mode`. Each answer remembers
// which destination and mode it's for, so routes for an old pin or another
// mode are never shown — no manual resetting needed.
export default function useRoute(destination, mode) {
  // { to, mode, routes, bounds, selected } — `selected` is the chosen route.
  const [answer, setAnswer] = useState(null);
  const [loadingFor, setLoadingFor] = useState(null);

  // Fetch routes from `start` ([lng, lat]) for `forMode` and return them.
  // Throws if it fails. The first (best) route starts out chosen.
  const findRoute = useCallback(
    async (start, forMode) => {
      const to = destination;
      // Each request gets its own object, so a request can tell whether it
      // is still the newest one — even for the same pin and mode.
      const request = { to, mode: forMode };
      setLoadingFor(request);
      try {
        const result = await fetchRoutes(start, to.lngLat, forMode);
        setAnswer({ to, mode: forMode, ...result, selected: 0 });
        return result;
      } finally {
        // Only clear if a newer request hasn't started meanwhile.
        setLoadingFor((current) => (current === request ? null : current));
      }
    },
    [destination],
  );

  const selectRoute = useCallback(
    (index) => setAnswer((current) => ({ ...current, selected: index })),
    [],
  );

  const current =
    answer?.to === destination && answer?.mode === mode ? answer : null;

  return {
    routes: current?.routes ?? null,
    // [west, south, east, north] around all the routes.
    routeBounds: current?.bounds ?? null,
    selectedRoute: current?.selected ?? 0,
    selectRoute,
    // Loading only counts for the pin and mode on screen now.
    routeLoading:
      destination !== null &&
      loadingFor?.to === destination &&
      loadingFor?.mode === mode,
    findRoute,
  };
}
