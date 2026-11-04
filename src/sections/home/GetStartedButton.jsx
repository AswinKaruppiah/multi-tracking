import { ActivityIndicator, Pressable, Text, View } from "react-native";

import Show from "@/components/Show";
import { colors } from "@/styles/theme";

export default function GetStartedButton({ onPress, loading, loadingText }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className="h-16 flex-1 justify-center rounded-full bg-brand-black active:opacity-80"
    >
      <Show>
        <Show.If isTrue={loading}>
          <View className="flex-row items-center justify-center gap-2">
            <ActivityIndicator color={colors.brand.white} />
            <Text className="font-helvetica text-base text-brand-white">
              {loadingText}
            </Text>
          </View>
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
