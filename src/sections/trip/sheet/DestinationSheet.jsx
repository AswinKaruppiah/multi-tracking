import { BottomSheet } from "heroui-native";
import { Route } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import Show from "@/components/Show";
import { TripPortalBridge, useTrip } from "@/context/trip/TripContext";

import RouteOptions from "./RouteOptions";
import TravelModePicker from "./TravelModePicker";

// Bottom sheet for the chosen destination. Opens when a pin is dropped;
// swiping it down or tapping Clear removes the pin. Pick how to travel, then
// Directions draws the routes from the user to here, listed below the modes.
// No overlay, so the map behind stays usable.
export default function DestinationSheet() {
  const trip = useTrip();
  const {
    destination,
    clearDestination,
    routes,
    routeLoading,
    showDirections,
    sheetTop,
    setSheetHeight,
  } = trip;

  // Remember the last place, so the text stays while the sheet slides away.
  const [place, setPlace] = useState(destination);
  if (destination && destination !== place) setPlace(destination);

  return (
    <BottomSheet
      isOpen={!!destination}
      // Swiped down: remove the pin too.
      onOpenChange={(open) => !open && clearDestination()}
    >
      <BottomSheet.Portal>
        {/* The portal draws outside TripProvider; pass the trip state in so
            TravelModePicker and RouteOptions can use useTrip(). */}
        <TripPortalBridge value={trip}>
          <BottomSheet.Content
            backgroundClassName="bg-brand-white"
            // The sheet writes its top edge here every frame (map buttons follow
            // it) and reports its height (routes are fitted above it).
            animatedPosition={sheetTop}
            contentContainerProps={{
              onLayout: (event) => setSheetHeight(event.nativeEvent.layout.height),
            }}
          >
            <BottomSheet.Title
              numberOfLines={1}
              className="font-helvetica-medium text-lg text-brand-black"
            >
              {place?.name}
            </BottomSheet.Title>
            <Show>
              <Show.If isTrue={!!place?.address}>
                <BottomSheet.Description
                  numberOfLines={1}
                  className="mt-0.5 font-helvetica text-sm text-black/50"
                >
                  {place?.address}
                </BottomSheet.Description>
              </Show.If>
            </Show>
  
            <View className="mt-6 gap-2">
              <TravelModePicker />
              <Show>
                <Show.If isTrue={!!routes}>
                  <RouteOptions />
                </Show.If>
              </Show>
            </View>
  
            <View className="mt-7 flex-row gap-3">
              <Pressable
                onPress={clearDestination}
                className="h-12 flex-1 items-center justify-center rounded-full bg-red-50 active:opacity-80"
              >
                <Text className="font-helvetica text-base text-red-600">
                  Clear
                </Text>
              </Pressable>
              <Pressable
                onPress={showDirections}
                disabled={routeLoading}
                className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-brand-black active:opacity-80"
              >
                <Route size={18} color="#FFFFFF" strokeWidth={1.75} />
                <Text className="font-helvetica text-base text-brand-white">
                  <Show>
                    <Show.If isTrue={routeLoading}>Finding…</Show.If>
                    <Show.Else>Directions</Show.Else>
                  </Show>
                </Text>
              </Pressable>
            </View>
          </BottomSheet.Content>
        </TripPortalBridge>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
