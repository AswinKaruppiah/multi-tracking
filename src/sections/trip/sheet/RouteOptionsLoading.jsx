import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// Shown in place of RouteOptions while routes are loading: two gray cards the
// same size as the real ones (so the sheet doesn't jump), gently pulsing.
export default function RouteOptionsLoading() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Fade to half and back, forever, until routes arrive and this unmounts.
    opacity.set(withRepeat(withTiming(0.5, { duration: 700 }), -1, true));
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View style={pulseStyle} accessibilityLabel="Finding routes">
      <View className="flex-row gap-2">
        {[0, 1].map((key) => (
          <View
            key={key}
            className="flex-1 rounded-2xl border border-transparent bg-brand-gray px-3 py-2.5"
          >
            {/* Same heights as a card's time line (text-lg) and distance row. */}
            <View className="h-7 justify-center">
              <View className="h-4 w-16 rounded-full bg-black/10" />
            </View>
            <View className="mt-0.5 h-5 justify-center">
              <View className="h-2.5 w-10 rounded-full bg-black/10" />
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
