import { Pressable, Text } from "react-native";

export default function GetStartedButton({ onPress }) {
  return (
    <Pressable onPress={onPress} className="rounded-full bg-brand-black py-4 active:opacity-80">
      <Text className="text-center font-helvetica text-base text-brand-white">Get started</Text>
    </Pressable>
  );
}
