import { LocateFixed } from "lucide-react-native";
import { memo } from "react";
import { Pressable } from "react-native";

function LocateButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Center on my location"
      className="h-12 w-12 items-center justify-center rounded-full bg-white active:opacity-80"
    >
      <LocateFixed size={22} color="rgba(0,0,0,0.5)" strokeWidth={2} />
    </Pressable>
  );
}

export default memo(LocateButton);
