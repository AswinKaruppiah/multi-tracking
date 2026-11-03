import { Text, View } from "react-native";

export default function HomeIntro() {
  return (
    <View className="gap-3">
      <Text className="font-helvetica text-5xl uppercase leading-[45px] text-brand-black">
        It's time{"\n"}to explore{"\n"}the world
      </Text>
      <Text className="font-helvetica text-sm leading-5 text-brand-black/50">
        Explore new places, get inspired, and plan memorable trips with ease.
      </Text>
    </View>
  );
}
