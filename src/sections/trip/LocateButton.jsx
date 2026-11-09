import { LocateFixed } from "lucide-react-native";
import { memo } from "react";
import { Pressable } from "react-native";

// `raised` lifts the button above the destination card.
function LocateButton({ onPress, raised }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Center on my location"
      className={`absolute left-5 h-12 w-12 items-center justify-center rounded-full bg-white active:opacity-80 ${
        raised ? "bottom-safe-offset-44" : "bottom-safe-offset-5"
      }`}
    >
      <LocateFixed size={22} color="rgba(0,0,0,0.5)" strokeWidth={2} />
    </Pressable>
  );
}

export default memo(LocateButton);
