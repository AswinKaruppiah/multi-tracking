import { Camera, Map } from "@maplibre/maplibre-react-native";
import { Text, View } from "react-native";

// Free OpenStreetMap-based style from OpenFreeMap — no API key needed.
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

// [longitude, latitude] the map opens on.
const DEFAULT_CENTER = [80.2707, 13.0827];

export default function HomeHero() {
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
        <Camera initialViewState={{ center: DEFAULT_CENTER, zoom: 12 }} />
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
