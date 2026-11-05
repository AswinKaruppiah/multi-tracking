import React from "react";
import { View } from "react-native";
import HomeView from "@/sections/home/HomeView";

export default function HomePage() {
  // pb-safe-offset-4 = bottom safe area + 14px (rem is 14) (insets come from the root layout).
  return (
    <View className="flex-1 pb-safe-offset-4 bg-brand-white">
      <HomeView />
    </View>
  );
}
