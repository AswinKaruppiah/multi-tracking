import { Map as MapIcon, RefreshCw, Satellite } from "lucide-react-native";
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
          <View className="w-full items-center px-6">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-gray">
              <Satellite size={28} color="#000000" strokeWidth={1.75} />
            </View>

            <Text className="mt-5 text-xl text-brand-black">
              Satellite view didn&apos;t load
            </Text>
            <Text className="mt-2 text-center text-sm leading-5 text-black/50">
              Check your internet connection and try again, or use the street
              map for now.
            </Text>

            <View className="mt-6 w-full gap-3">
              <Pressable
                onPress={onRetry}
                accessibilityRole="button"
                className="h-12 w-full flex-row items-center justify-center gap-2 rounded-full bg-brand-black active:opacity-80"
              >
                <RefreshCw size={18} color="#FFFFFF" strokeWidth={2} />
                <Text className="text-base text-brand-white">Try again</Text>
              </Pressable>
              <Pressable
                onPress={onShowStreetMap}
                accessibilityRole="button"
                className="h-12 w-full flex-row items-center justify-center gap-2 rounded-full bg-brand-white active:opacity-80"
              >
                <MapIcon size={18} color="#000000" strokeWidth={1.75} />
                <Text className="text-base text-brand-black">
                  Use street map
                </Text>
              </Pressable>
            </View>
          </View>
        </Show.If>
        <Show.Else>
          <View className="items-center gap-3">
            <ActivityIndicator color="#000000" size="large" />
            <Text className="text-sm text-black/50">
              Loading satellite view…
            </Text>
          </View>
        </Show.Else>
      </Show>
    </View>
  );
}

export default memo(SatelliteStatus);
