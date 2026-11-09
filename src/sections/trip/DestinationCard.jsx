import { Route } from "lucide-react-native";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import Show from "@/components/Show";

// Bottom card for the chosen destination. Clearing is done with the
// search bar's X. Directions draws the route from the user to here.
function DestinationCard({ destination, routeLoading, onDirections, onStart }) {
  return (
    <View className="absolute left-5 right-5 bottom-safe-offset-5 rounded-3xl bg-brand-white p-4 shadow-float">
      <Text numberOfLines={1} className="text-lg text-brand-black">
        {destination.name}
      </Text>
      <Show>
        <Show.If isTrue={!!destination.address}>
          <Text numberOfLines={1} className="text-sm text-black/50">
            {destination.address}
          </Text>
        </Show.If>
      </Show>

      <View className="mt-4 flex-row gap-3">
        <Pressable
          onPress={onDirections}
          disabled={routeLoading}
          className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-brand-gray active:opacity-80"
        >
          <Route size={18} color="#000000" strokeWidth={1.75} />
          <Text className="text-base text-brand-black">
            <Show>
              <Show.If isTrue={routeLoading}>Finding…</Show.If>
              <Show.Else>Directions</Show.Else>
            </Show>
          </Text>
        </Pressable>
        <Pressable
          onPress={onStart}
          className="h-12 flex-1 items-center justify-center rounded-full bg-brand-black active:opacity-80"
        >
          <Text className="text-base text-brand-white">Start</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default memo(DestinationCard);
