import { useRef, useState } from "react";
import { View } from "react-native";

import useUserLocation from "@/hooks/useUserLocation";

import LocateButton from "./LocateButton";
import TripMap from "./TripMap";
import TripSearchBar from "./TripSearchBar";

export default function TripView() {
  const { userLngLat } = useUserLocation();
  const cameraRef = useRef(null);
  const [query, setQuery] = useState("");

  // Brings the map back to the user after they've panned away.
  const centerOnUser = () => {
    if (!userLngLat) return;
    cameraRef.current?.easeTo({ center: userLngLat, zoom: 15, duration: 400 });
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
