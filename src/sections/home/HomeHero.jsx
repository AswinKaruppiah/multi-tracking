import { Camera, Map, Marker } from "@maplibre/maplibre-react-native";
import { Text, View } from "react-native";

import { DEFAULT_CENTER, MAP_STYLE } from "@/constants/map";

export default function HomeHero({ userLngLat }) {
  return (
    <View className="flex-[7] overflow-hidden rounded-b-[32px]">
      {/* TextureView so the rounded corners clip the map on Android. */}
      <Map
        mapStyle={MAP_STYLE}
        androidView="texture"
        logo={false}
        compass={false}
        attribution={false}
      >
        <Camera
          initialViewState={{ center: DEFAULT_CENTER, zoom: 12 }}
          center={userLngLat ?? undefined}
          zoom={15}
          pitch={60}
          // Animate camera changes instead of jumping.
          duration={1500}
          easing="fly"
        />

        {userLngLat && (
          <Marker lngLat={userLngLat}>
            <View className="h-6 w-6 rounded-full border-[3px] border-white bg-blue-500" />
          </Marker>
        )}
      </Map>

      {/* Replaces the hidden ⓘ button — OpenStreetMap's licence requires visible credit. */}
      <Text
        pointerEvents="none"
        className="absolute bottom-3 right-8 text-[10px] text-black/60"
      >
        © OpenStreetMap
      </Text>
    </View>
  );
}
