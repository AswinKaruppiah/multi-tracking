import { View } from "react-native";

import useUserLocation from "@/hooks/useUserLocation";

import GetStartedButton from "./GetStartedButton";
import HomeHero from "./HomeHero";
import HomeIntro from "./HomeIntro";
import JoinButton from "./JoinButton";

export default function HomeView() {
  const { userLngLat, locating, locateUser } = useUserLocation();

  const handleGetStarted = async () => {
    await locateUser();
  };

  const handleJoin = () => {
    console.log("Join tapped");
  };

  return (
    <View className="flex-1">
      <HomeHero userLngLat={userLngLat} />
      <View className="flex-[3] justify-between px-5 pt-5">
        <HomeIntro />
        <View className="flex-row items-center gap-1">
          <GetStartedButton onPress={handleGetStarted} loading={locating} />
          <JoinButton onPress={handleJoin} />
        </View>
      </View>
    </View>
  );
}
