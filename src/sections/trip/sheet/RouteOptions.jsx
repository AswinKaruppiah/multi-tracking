import { Pressable, Text, View } from "react-native";

import Show from "@/components/Show";
import { useTrip } from "@/context/trip/TripContext";
import { formatDistance, formatDuration } from "@/utils/format";

// The routes side by side, colored like their lines on the map: the chosen
// one blue, the others gray. Tap one to choose it. The first is ORS's best.
export default function RouteOptions() {
  const { routes, selectedRoute, selectRoute } = useTrip();

  return (
    <View className="flex-row gap-2">
      {routes.map((route, index) => {
        const active = index === selectedRoute;
        return (
          <Pressable
            key={index}
            onPress={() => selectRoute(index)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            className={`flex-1 rounded-2xl border px-3 py-2.5 active:opacity-80 ${
              active
                ? "border-blue-500 bg-blue-50"
                : "border-transparent bg-brand-gray"
            }`}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className={`font-helvetica-medium text-lg ${
                active ? "text-blue-700" : "text-brand-black"
              }`}
            >
              {formatDuration(route.duration)}
            </Text>
            <View className="mt-0.5 flex-row items-center justify-between gap-1">
              <Text
                numberOfLines={1}
                className={`font-helvetica text-xs ${
                  active ? "text-blue-700/70" : "text-black/50"
                }`}
              >
                {formatDistance(route.distance)}
              </Text>
              <Show>
                <Show.If isTrue={index === 0}>
                  <Text className="rounded-full bg-blue-500 h-5 px-2 font-helvetica-medium text-[10px] text-brand-white">
                    Best
                  </Text>
                </Show.If>
              </Show>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

