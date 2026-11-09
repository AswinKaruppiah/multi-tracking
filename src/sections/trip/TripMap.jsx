import { Camera, Map } from "@maplibre/maplibre-react-native";
import { memo, useCallback } from "react";
import { Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import Show from "@/components/Show";
import { MAP_STYLE } from "@/constants/map";

import DestinationMarker from "./DestinationMarker";
import RouteLine from "./RouteLine";
import UserMarker from "./UserMarker";

// Memoized: re-renders only when the destination changes. GPS updates
// re-render only UserMarker, never the map itself.
function TripMap({
  cameraRef,
  initialCenter,
  destination,
  route,
  onLongPress,
}) {
  // Map rotation, so the heading cone still points the real-world direction.
  // A shared value: rotating the map doesn't re-render anything.
  const bearing = useSharedValue(0);
  const handleRegionChange = useCallback(
    (event) => bearing.set(event.nativeEvent.bearing),
    [bearing],
  );

  // Holding a finger on the map picks that spot as the destination.
  const handleLongPress = useCallback(
    (event) => onLongPress(event.nativeEvent.lngLat),
    [onLongPress],
  );

  return (
    <View className="flex-1">
      <Map
        mapStyle={MAP_STYLE}
        logo={false}
        compass={false}
        attribution={false}
        onLongPress={handleLongPress}
        onRegionIsChanging={handleRegionChange}
        onRegionDidChange={handleRegionChange}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{ center: initialCenter, zoom: 15 }}
        />

        {/* `?.`: Show.If builds its children even when false. */}
        <Show>
          <Show.If isTrue={!!route}>
            <RouteLine geometry={route?.geometry} />
          </Show.If>
        </Show>
        <Show>
          <Show.If isTrue={!!destination}>
            <DestinationMarker lngLat={destination?.lngLat} />
          </Show.If>
        </Show>
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
