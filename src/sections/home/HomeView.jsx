import { View } from "react-native";

import GetStartedButton from "./GetStartedButton";
import HomeHeader from "./HomeHeader";

export default function HomeView({ onGetStarted }) {
  return (
    <View className="flex-1 justify-between">
      <View className="flex-1 justify-center">
        <HomeHeader />
      </View>
      <GetStartedButton onPress={onGetStarted} />
    </View>
  );
}
