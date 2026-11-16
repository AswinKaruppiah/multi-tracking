import { useCallback, useEffect, useState } from "react";

import {
  getLoadedSatelliteStyle,
  loadSatelliteStyle,
} from "@/services/satelliteStyle";

// The ArcGIS satellite style. Usually already downloaded at app launch, so
// it's ready straight away. No fallback: a missing or bad key, or no
// connection, sets `error`.
export default function useSatelliteStyle(enabled) {
  const [style, setStyle] = useState(getLoadedSatelliteStyle);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled || style) return;
    let active = true;
    loadSatelliteStyle()
      .then((loaded) => active && setStyle(loaded))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, [enabled, style, attempt]);

  const retry = useCallback(() => {
    setError(false);
    setAttempt((n) => n + 1);
  }, []);

  return { style, error, retry };
}
