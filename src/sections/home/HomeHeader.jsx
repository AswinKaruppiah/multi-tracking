import { Text, View } from "react-native";

export default function HomeHeader() {
  return (
    <View className="items-center gap-2">
      <Text className="font-helvetica-bold text-3xl text-brand-black">Tracking</Text>
      <Text className="font-helvetica text-base text-brand-black/60">Keep track of everything in one place</Text>
    </View>
  );
}
