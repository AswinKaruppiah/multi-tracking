import { memo } from "react";
import { View } from "react-native";

// The blue "you are here" dot. Memoized so a moving Marker doesn't rebuild it.
function UserDot() {
  return (
    <View className="h-6 w-6 rounded-full border border-white bg-blue-500 shadow-float" />
  );
}

export default memo(UserDot);
