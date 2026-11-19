import { Camera, Map } from "@maplibre/maplibre-react-native";
import { useCallback } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import Show from "@/components/Show";
import { MAP_STYLE } from "@/constants/map";
import { useTrip } from "@/context/trip/TripContext";
import useSatelliteStyle from "@/hooks/useSatelliteStyle";

import DestinationMarker from "./DestinationMarker";
import RouteLine from "./RouteLine";
import SatelliteStatus from "./SatelliteStatus";
import UserMarker from "./UserMarker";

// The map with the user, the pin and the routes. GPS updates re-render only
// UserMarker, never the map itself.
export default function TripMap() {
  const {
    cameraRef,
    initialCenter,
    destination,
    routes,
    selectedRoute,
    satellite,
    dropPin,
    showStreetMap,
  } = useTrip();

  // Map rotation, so the heading cone still points the real-world direction.
  // A shared value: rotating the map doesn't re-render anything.
  const bearing = useSharedValue(0);

  // ArcGIS satellite style. Until it's ready (or if it fails),
  // SatelliteStatus covers the map.
  const {
    style: satelliteStyle,
    error: satelliteError,
    retry: retrySatellite,
  } = useSatelliteStyle(satellite);
  const showSatellite = satellite && !!satelliteStyle;

  const handleRegionChange = useCallback(
    (event) => bearing.set(event.nativeEvent.bearing),
    [bearing],
  );

  // Holding a finger on the map picks that spot as the destination.
  const handleLongPress = useCallback(
    (event) => dropPin(event.nativeEvent.lngLat),
    [dropPin],
  );

  return (
    <View className="flex-1 bg-brand-gray">
      <Map
        // Street map underneath while satellite loads; it's covered anyway.
        mapStyle={showSatellite ? satelliteStyle : MAP_STYLE}
        // Android's default surface view is black until its first frame;
        // a texture view stays see-through, so the gray behind shows instead.
        androidView="texture"
        logo={false}
        compass={false}
        attribution={false}
        onLongPress={handleLongPress}
        onRegionIsChanging={handleRegionChange}
        onRegionDidChange={handleRegionChange}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{ center: initialCenter, zoom: 17 }}
        />

        {/* `?.`: Show.If builds its children even when false. */}
        <Show>
          <Show.If isTrue={!!routes}>
            <RouteLine routes={routes} selected={selectedRoute} />
          </Show.If>
        </Show>
        <Show>
          <Show.If isTrue={!!destination}>
            <DestinationMarker lngLat={destination?.lngLat} />
          </Show.If>
        </Show>
        <UserMarker bearing={bearing} />
      </Map>

      <Show>
        <Show.If isTrue={satellite && !satelliteStyle}>
          <SatelliteStatus
            error={satelliteError}
            onRetry={retrySatellite}
            onShowStreetMap={showStreetMap}
          />
        </Show.If>
      </Show>
    </View>
  );
}
