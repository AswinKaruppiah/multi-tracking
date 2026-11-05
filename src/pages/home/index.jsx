import React from "react";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";
import HomeView from "@/sections/home/HomeView";

// Uniwind only maps className on core RN components; wrap third-party ones.
const SafeAreaView = withUniwind(RNSafeAreaView);

export default function HomePage() {
  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 pb-4 bg-brand-white">
      <HomeView />
    </SafeAreaView>
  );
}
