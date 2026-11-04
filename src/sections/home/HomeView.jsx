import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";

import useUserLocation from "@/hooks/useUserLocation";

import GetStartedButton from "./GetStartedButton";
import HomeHero from "./HomeHero";
import HomeIntro from "./HomeIntro";
import JoinButton from "./JoinButton";

const TRIP_DELAY_MS = 2000;

export default function HomeView() {
  const { userLngLat, locating, locateUser } = useUserLocation();
  // True during the pause between finding the user and opening /trip.
  const [starting, setStarting] = useState(false);

  // Home only makes sure location works; the trip itself happens on /trip.
  const handleGetStarted = async () => {
    const alreadyFound = userLngLat !== null;
    const lngLat = await locateUser();
    if (!lngLat) return;

    if (alreadyFound) {
      router.push("/trip");
      return;
    }

    // First time only: pause so the user sees their pin before the screen changes.
    setStarting(true);
    await new Promise((resolve) => setTimeout(resolve, TRIP_DELAY_MS));
    router.push("/trip");
  };

  // Keep the spinner through the screen transition; reset when back on Home.
  useFocusEffect(
    useCallback(() => {
      setStarting(false);
    }, []),
  );

  const handleJoin = () => {
    console.log("Join tapped");
  };

  return (
    <View className="flex-1">
      <HomeHero userLngLat={userLngLat} />
      <View className="flex-[3] justify-between px-5 pt-5">
        <HomeIntro />
        <View className="flex-row items-center gap-1">
          <GetStartedButton
            onPress={handleGetStarted}
            loading={locating || starting}
            loadingText={locating ? "Finding location…" : "Opening map…"}
          />
          <JoinButton onPress={handleJoin} />
        </View>
      </View>
    </View>
  );
}
