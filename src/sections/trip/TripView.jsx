import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { DEFAULT_CENTER } from "@/constants/map";
import useUserLocation from "@/hooks/useUserLocation";

import LocateButton from "./LocateButton";
import TripMap from "./TripMap";
import TripSearchBar from "./TripSearchBar";

export default function TripView() {
  const { userLngLat, locateUser, watchUser } = useUserLocation();
  const cameraRef = useRef(null);
  const [query, setQuery] = useState("");
  // Where the map opens — read once so later GPS updates don't touch TripMap.
  const [initialCenter] = useState(() => userLngLat ?? DEFAULT_CENTER);

  // Live location while this screen is open; GPS stops when it closes.
  useEffect(() => watchUser(), [watchUser]);

  // Follow the user: move the map with each new position. 1 s linear matches
  // UserMarker's glide, so the dot stays centred.
  useEffect(() => {
    if (!userLngLat) return;
    cameraRef.current?.easeTo({ center: userLngLat, duration: 1000, easing: "linear" });
  }, [userLngLat]);

  // Brings the map back to the user after they've panned away. Checks first
  // that permission is still given and the phone's location is on.
  const centerOnUser = useCallback(async () => {
    const lngLat = await locateUser();
    if (!lngLat) return;
    cameraRef.current?.easeTo({ center: lngLat, zoom: 15, duration: 400 });
  }, [locateUser]);

  const handleSearch = useCallback(() => {
    console.log("Search:", query);
  }, [query]);

  return (
    <View className="flex-1">
      <TripMap cameraRef={cameraRef} initialCenter={initialCenter} />
      <TripSearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearch}
      />
      <LocateButton onPress={centerOnUser} />
    </View>
  );
}
