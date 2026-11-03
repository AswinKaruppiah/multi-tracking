import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { HomeView } from "../../sections/home";

export default function HomePage() {
  const handleGetStarted = () => {
    console.log("Get started tapped");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-brand-gray px-4 pt-2 pb-4">
        <HomeView onGetStarted={handleGetStarted} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
