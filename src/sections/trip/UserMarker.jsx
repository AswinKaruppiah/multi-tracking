import { Marker } from "@maplibre/maplibre-react-native";
import { memo } from "react";

import UserDot from "@/components/UserDot";
import useAnimatedLngLat from "@/hooks/useAnimatedLngLat";
import useUserLocation from "@/hooks/useUserLocation";

// Reads the live location itself, so only this marker re-renders on each GPS
// update — not the map around it.
function UserMarker() {
  const { userLngLat } = useUserLocation();
  // ~1 s glide matches the GPS update rate, so the dot moves continuously.
  const lngLat = useAnimatedLngLat(userLngLat, 1000);

  if (!lngLat) return null;

  return (
    <Marker id="user-location" lngLat={lngLat} anchor="center">
      <UserDot />
    </Marker>
  );
}

export default memo(UserMarker);
