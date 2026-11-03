import { Image } from "expo-image";
import { View } from "react-native";

const HERO_IMAGE = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80";

export default function HomeHero() {
  return (
    <View className="flex-[7] overflow-hidden rounded-b-[32px]">
      <Image source={{ uri: HERO_IMAGE }} className="flex-1" contentFit="cover" transition={300} />
    </View>
  );
}
