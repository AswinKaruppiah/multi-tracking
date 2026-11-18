import { useCallback, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// What the trip map's camera does: centre on the user, and fit a route on
// screen. It never moves on its own.
export default function useTripCamera({ locateUser }) {
  const cameraRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Centre and zoom on the user once. Checks first that permission is still
  // given and the phone's location is on.
  const centerOnUser = useCallback(async () => {
    const lngLat = await locateUser();
    if (!lngLat) return;
    cameraRef.current?.easeTo({ center: lngLat, zoom: 17, duration: 400 });
  }, [locateUser]);

  // Zoom so the whole route is visible, with room for the sheet at the bottom.
  const fitRoute = useCallback(
    (bounds) => {
      cameraRef.current?.fitBounds(bounds, {
        padding: {
          top: insets.top + 50,
          bottom: insets.bottom + 200,
          left: 50,
          right: 50,
        },
        duration: 800,
      });
    },
    [insets],
  );

  return { cameraRef, centerOnUser, fitRoute };
}
