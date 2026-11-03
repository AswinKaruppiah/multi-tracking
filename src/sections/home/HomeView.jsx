import { View } from "react-native";

import GetStartedButton from "./GetStartedButton";
import HomeHero from "./HomeHero";
import HomeIntro from "./HomeIntro";

export default function HomeView({ onGetStarted }) {
  return (
    <View className="flex-1">
      <HomeHero />
      <View className="flex-[3] justify-between px-5 pt-5">
        <HomeIntro />
        <GetStartedButton onPress={onGetStarted} />
      </View>
    </View>
  );
}
