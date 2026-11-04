import { ActivityIndicator, Pressable, Text } from "react-native";

import Show from "@/components/Show";
import { colors } from "@/styles/theme";

export default function GetStartedButton({ onPress, loading }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className="h-16 flex-1 justify-center rounded-full bg-brand-black active:opacity-80"
    >
      <Show>
        <Show.If isTrue={loading}>
          <ActivityIndicator color={colors.brand.white} />
        </Show.If>
        <Show.Else>
          <Text className="text-center font-helvetica text-base text-brand-white">
            Start Trip
          </Text>
        </Show.Else>
      </Show>
    </Pressable>
  );
}
