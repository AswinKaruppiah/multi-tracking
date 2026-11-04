import { Camera, Map, Marker } from "@maplibre/maplibre-react-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DEFAULT_CENTER, MAP_STYLE } from "@/constants/map";

export default function TripMap({ userLngLat, cameraRef }) {
  const insets = useSafeAreaInsets();

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
          initialViewState={{ center: userLngLat ?? DEFAULT_CENTER, zoom: 15 }}
        />

        {userLngLat && (
          <Marker lngLat={userLngLat}>
            <View className="h-6 w-6 rounded-full border-[3px] border-white bg-blue-500" />
          </Marker>
        )}
      </Map>

      {/* OpenStreetMap's licence requires visible credit. */}
      <Text
        pointerEvents="none"
        className="absolute right-4 text-[10px] text-black/60"
        style={{ bottom: insets.bottom + 8 }}
      >
        © OpenStreetMap
      </Text>
    </View>
  );
}
