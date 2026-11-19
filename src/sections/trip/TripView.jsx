import { View } from "react-native";

import { TripProvider, useTrip } from "@/context/trip/TripContext";

import MapButtons from "./controls/MapButtons";
import TripMap from "./map/TripMap";
import DestinationSheet from "./sheet/DestinationSheet";

// The trip screen: the map, its buttons and the destination sheet. They share
// state through TripProvider instead of props.
export default function TripView() {
  return (
    <TripProvider>
      <TripLayout />
    </TripProvider>
  );
}

function TripLayout() {
  const { screenHeight } = useTrip();

  return (
    <View
      className="flex-1"
      onLayout={(event) => screenHeight.set(event.nativeEvent.layout.height)}
    >
      <TripMap />
      <MapButtons />
      <DestinationSheet />
    </View>
  );
}
