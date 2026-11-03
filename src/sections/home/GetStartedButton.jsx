import { Pressable, Text } from "react-native";

export default function GetStartedButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="h-16 flex-1 justify-center rounded-full bg-brand-black active:opacity-80"
    >
      <Text className="text-center font-helvetica text-base text-brand-white">
        Start Trip
      </Text>
    </Pressable>
  );
}
