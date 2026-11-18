import { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Everything the trip map's camera does: follow the user, centre on them,
// and fit a route on screen.
export default function useTripCamera({ userLngLat, locateUser }) {
  const cameraRef = useRef(null);
  // When on, the map moves with the user. Off while looking at a destination.
  const [following, setFollowing] = useState(true);
  const insets = useSafeAreaInsets();

  // Follow: move the map with each new position. 1 s linear matches
  // UserMarker's glide, so the dot stays centred.
  useEffect(() => {
    if (!userLngLat || !following) return;
    cameraRef.current?.easeTo({
      center: userLngLat,
      duration: 1000,
      easing: "linear",
    });
  }, [userLngLat, following]);

  // Centre and zoom on the user once. Checks first that permission is still
  // given and the phone's location is on.
  const centerOnUser = useCallback(async () => {
    const lngLat = await locateUser();
    if (!lngLat) return null;
    cameraRef.current?.easeTo({ center: lngLat, zoom: 17, duration: 400 });
    return lngLat;
  }, [locateUser]);

  // Centre on the user and keep the map moving with them.
  const startFollowing = useCallback(async () => {
    if (await centerOnUser()) setFollowing(true);
  }, [centerOnUser]);

  // So GPS updates stop pulling the map back to the user.
  const stopFollowing = useCallback(() => setFollowing(false), []);

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

  return { cameraRef, centerOnUser, startFollowing, stopFollowing, fitRoute };
}
