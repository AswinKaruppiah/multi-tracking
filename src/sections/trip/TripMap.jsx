import { Camera, Map } from "@maplibre/maplibre-react-native";
import { memo, useCallback } from "react";
import { Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { MAP_STYLE } from "@/constants/map";

import UserMarker from "./UserMarker";

// Memoized: props never change after mount, so GPS updates re-render only
// UserMarker, never the map itself.
function TripMap({ cameraRef, initialCenter }) {
  // Map rotation, so the heading cone still points the real-world direction.
  // A shared value: rotating the map doesn't re-render anything.
  const bearing = useSharedValue(0);
  const handleRegionChange = useCallback(
    (event) => bearing.set(event.nativeEvent.bearing),
    [bearing],
  );

  return (
    <View className="flex-1">
      <Map
        mapStyle={MAP_STYLE}
        logo={false}
        compass={false}
        attribution={false}
        onRegionIsChanging={handleRegionChange}
        onRegionDidChange={handleRegionChange}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{ center: initialCenter, zoom: 15 }}
        />

        <UserMarker bearing={bearing} />
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
