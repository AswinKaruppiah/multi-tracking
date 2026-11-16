import { memo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import Show from "@/components/Show";

// Covers the map while the satellite style loads, or when it failed. On
// failure the user can try again or switch to the street map.
function SatelliteStatus({ error, onRetry, onShowStreetMap }) {
  return (
    <View className="absolute inset-0 items-center justify-center bg-brand-gray px-5">
      <Show>
        <Show.If isTrue={error}>
          <View className="w-full rounded-3xl bg-brand-white p-5">
            <Text className="text-lg text-brand-black">
              Satellite map unavailable
            </Text>
            <Text className="mt-1 text-sm text-black/50">
              Check your connection and try again.
            </Text>

            <View className="mt-5 flex-row gap-3">
              <Pressable
                onPress={onRetry}
                className="h-12 flex-1 items-center justify-center rounded-full bg-brand-gray active:opacity-80"
              >
                <Text className="text-base text-brand-black">Try again</Text>
              </Pressable>
              <Pressable
                onPress={onShowStreetMap}
                className="h-12 flex-1 items-center justify-center rounded-full bg-brand-black active:opacity-80"
              >
                <Text className="text-base text-brand-white">Street map</Text>
              </Pressable>
            </View>
          </View>
        </Show.If>
        <Show.Else>
          <ActivityIndicator color="#000000" size={"large"} />
        </Show.Else>
      </Show>
    </View>
  );
}

export default memo(SatelliteStatus);
