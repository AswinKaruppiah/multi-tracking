import { LocateFixed } from "lucide-react-native";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LocateButton({ onPress }) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Center on my location"
      className="absolute left-5 h-12 w-12 items-center justify-center rounded-full bg-white active:opacity-80"
      style={{ bottom: insets.bottom + 20 }}
    >
      <LocateFixed size={22} color="rgba(0,0,0,0.5)" strokeWidth={2} />
    </Pressable>
  );
}
