import { Camera, Map } from "@maplibre/maplibre-react-native";
import { memo } from "react";
import { Text, View } from "react-native";

import { MAP_STYLE } from "@/constants/map";

import UserMarker from "./UserMarker";

// Memoized: props never change after mount, so GPS updates re-render only
// UserMarker, never the map itself.
function TripMap({ cameraRef, initialCenter }) {
  return (
    <View className="flex-1">
      <Map
        mapStyle={MAP_STYLE}
        logo={false}
        compass={false}
        attribution={false}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{ center: initialCenter, zoom: 15 }}
        />

        <UserMarker />
      </Map>

      {/* OpenStreetMap's licence requires visible credit. */}
      <Text
        pointerEvents="none"
        className="absolute right-4 bottom-safe-offset-2 text-[10px] text-black/60"
      >
        © OpenStreetMap
      </Text>
    </View>
  );
}

export default memo(TripMap);
