import { Marker } from "@maplibre/maplibre-react-native";
import { memo } from "react";
import { View } from "react-native";

import UserDot from "@/components/UserDot";
import useAnimatedLngLat from "@/hooks/useAnimatedLngLat";
import useHeading from "@/hooks/useHeading";
import useUserLocation from "@/hooks/useUserLocation";

import HeadingCone, { BEAM_SIZE } from "./HeadingCone";

// Reads the live location itself, so only this marker re-renders on each GPS
// update — not the map around it. `bearing` is the map's rotation.
function UserMarker({ bearing }) {
  const { userLngLat } = useUserLocation();
  // ~1 s glide matches the GPS update rate, so the dot moves continuously.
  const lngLat = useAnimatedLngLat(userLngLat, 1000);
  const heading = useHeading();

  if (!lngLat) return null;

  return (
    <Marker id="user-location" lngLat={lngLat} anchor="center">
      {/* Square box so the beam rotates around the dot's centre.
          collapsable={false}: without it React Native flattens this layout-only
          View away, and the Marker positions the beam and dot separately. */}
      <View
        collapsable={false}
        className="items-center justify-center"
        style={{ width: BEAM_SIZE, height: BEAM_SIZE }}
      >
        <HeadingCone heading={heading} bearing={bearing} />
        <UserDot />
      </View>
    </Marker>
  );
}

export default memo(UserMarker);
