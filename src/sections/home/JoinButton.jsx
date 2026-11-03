import { UserRoundGroup } from "lucide-react-native";
import { Pressable } from "react-native";

import { colors, gradients } from "@/styles/theme";

export default function JoinButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Join"
      className="w-16 aspect-square items-center justify-center rounded-full active:opacity-80"
      style={{ experimental_backgroundImage: gradients.mono }}
    >
      <UserRoundGroup size={26} color={colors.brand.white} strokeWidth={2} />
    </Pressable>
  );
}
