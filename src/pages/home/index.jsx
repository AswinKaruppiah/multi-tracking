import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeView } from "../../sections/home";

export default function HomePage() {
  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 pb-4 bg-brand-white">
      <HomeView />
    </SafeAreaView>
  );
}
