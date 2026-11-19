import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTrip } from "@/context/trip/TripContext";

import LocateButton from "./LocateButton";
import MapStyleButton from "./MapStyleButton";

// Map buttons, stacked bottom-right. They ride on top of the destination
// sheet: as it slides up, gets dragged or slides away, they stay just above
// it. `sheetTop` (the sheet's top edge, from the top of the screen) and
// `screenHeight` are shared values, so this runs on the UI thread with no
// re-renders.
export default function MapButtons() {
  const { satellite, toggleSatellite, centerOnUser, sheetTop, screenHeight } =
    useTrip();
  const insets = useSafeAreaInsets();
  // Resting spot with no sheet: 20px above the home bar.
  const bottom = insets.bottom + 20;

  const liftStyle = useAnimatedStyle(() => {
    const sheetHeight = screenHeight.get() - sheetTop.get();
    // Lift only once the sheet reaches the buttons; keep a 24px gap above it.
    const lift = Math.max(0, sheetHeight + 24 - bottom);
    return { transform: [{ translateY: -lift }] };
  });

  return (
    <Animated.View
      style={[{ position: "absolute", right: 20, bottom, gap: 12 }, liftStyle]}
    >
      <MapStyleButton satellite={satellite} onPress={toggleSatellite} />
      <LocateButton onPress={centerOnUser} />
    </Animated.View>
  );
}
