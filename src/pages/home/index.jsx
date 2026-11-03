import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeView } from "../../sections/home";

export default function HomePage() {
  const handleGetStarted = () => {
    console.log("Get started tapped");
  };

  const handleJoin = () => {
    console.log("Join tapped");
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 pb-4 bg-brand-white">
      <HomeView onGetStarted={handleGetStarted} onJoin={handleJoin} />
    </SafeAreaView>
  );
}
