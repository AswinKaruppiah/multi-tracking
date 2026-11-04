import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import useUserLocation from "@/hooks/useUserLocation";

import LocateButton from "./LocateButton";
import TripMap from "./TripMap";
import TripSearchBar from "./TripSearchBar";

export default function TripView() {
  const { userLngLat, locateUser, watchUser } = useUserLocation();
  const cameraRef = useRef(null);
  const [query, setQuery] = useState("");

  // Live location while this screen is open; GPS stops when it closes.
  useEffect(() => watchUser(), [watchUser]);

  // Brings the map back to the user after they've panned away. Checks first
  // that permission is still given and the phone's location is on.
  const centerOnUser = async () => {
    const lngLat = await locateUser();
    if (!lngLat) return;
    cameraRef.current?.easeTo({ center: lngLat, zoom: 15, duration: 400 });
  };

  const handleSearch = () => {
    console.log("Search:", query);
  };

  return (
    <View className="flex-1">
      <TripMap userLngLat={userLngLat} cameraRef={cameraRef} />
      <TripSearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearch}
      />
      <LocateButton onPress={centerOnUser} />
    </View>
  );
}
