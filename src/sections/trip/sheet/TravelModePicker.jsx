import { Pressable, Text, View } from "react-native";

import { TRAVEL_MODES } from "@/constants/travelModes";
import { useTrip } from "@/context/trip/TripContext";

// Segmented control of travel modes: a gray track with the chosen mode as a
// white pill.
export default function TravelModePicker() {
  const { mode, changeMode } = useTrip();

  return (
    <View className="flex-row rounded-full bg-brand-gray p-1">
      {TRAVEL_MODES.map(({ id, label, Icon }) => {
        const active = id === mode;
        return (
          <Pressable
            key={id}
            onPress={() => changeMode(id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            className={`h-9 flex-1 flex-row items-center justify-center gap-1.5 rounded-full ${
              active ? "bg-brand-white shadow-sm" : "active:opacity-60"
            }`}
          >
            <Icon
              size={16}
              color={active ? "#000000" : "rgba(0,0,0,0.5)"}
              strokeWidth={1.75}
            />
            <Text
              className={`text-sm ${
                active
                  ? "font-helvetica-medium text-brand-black"
                  : "font-helvetica text-black/50"
              }`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

