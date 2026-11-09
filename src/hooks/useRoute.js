import { useCallback, useState } from "react";

import { fetchRoute } from "@/services/routing";

// The road route to `destination`. Each answer remembers which destination
// it's for, so a route for an old destination is never shown — no manual
// resetting needed when the destination changes or is cleared.
export default function useRoute(destination) {
  const [answer, setAnswer] = useState({ to: null, route: null });
  const [loadingFor, setLoadingFor] = useState(null);

  // Fetch the route from `start` ([lng, lat]) and return it. Throws if it fails.
  const findRoute = useCallback(
    async (start) => {
      const to = destination;
      setLoadingFor(to);
      try {
        const route = await fetchRoute(start, to.lngLat);
        setAnswer({ to, route });
        return route;
      } finally {
        // Only clear if a newer request hasn't started meanwhile.
        setLoadingFor((current) => (current === to ? null : current));
      }
    },
    [destination],
  );

  return {
    route: answer.to === destination ? answer.route : null,
    routeLoading: destination !== null && loadingFor === destination,
    findRoute,
  };
}
