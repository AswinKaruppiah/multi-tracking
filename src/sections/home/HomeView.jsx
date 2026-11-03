import { View } from "react-native";

import GetStartedButton from "./GetStartedButton";
import HomeHero from "./HomeHero";
import HomeIntro from "./HomeIntro";
import JoinButton from "./JoinButton";

export default function HomeView({ onGetStarted, onJoin }) {
  return (
    <View className="flex-1">
      <HomeHero />
      <View className="flex-[3] justify-between px-5 pt-5">
        <HomeIntro />
        <View className="flex-row items-center gap-1">
          <GetStartedButton onPress={onGetStarted} />
          <JoinButton onPress={onJoin} />
        </View>
      </View>
    </View>
  );
}
