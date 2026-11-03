import { Pressable, Text } from "react-native";

export default function GetStartedButton({ onPress }) {
  return (
    <Pressable onPress={onPress} className="rounded-xl bg-brand-black px-6 py-4 active:opacity-80">
      <Text className="text-center font-helvetica-medium text-base text-brand-white">Get started</Text>
    </Pressable>
  );
}
