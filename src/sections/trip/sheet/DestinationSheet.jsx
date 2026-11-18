import { BottomSheet } from "heroui-native";
import { Route } from "lucide-react-native";
import { memo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import Show from "@/components/Show";

// Bottom sheet for the chosen destination. Opens when a pin is dropped;
// swiping it down or tapping Clear removes the pin. Directions draws the route
// from the user to here. No overlay, so the map behind stays usable.
function DestinationSheet({
  // Shared value the sheet writes its top edge into on every frame, so the
  // map buttons can follow it.
  animatedPosition,
  destination,
  routeLoading,
  onDirections,
  onClear,
}) {
  // Remember the last place, so the text stays while the sheet slides away.
  const [place, setPlace] = useState(destination);
  if (destination && destination !== place) setPlace(destination);

  return (
    <BottomSheet
      isOpen={!!destination}
      // Swiped down: remove the pin too.
      onOpenChange={(open) => !open && onClear()}
    >
      <BottomSheet.Portal>
        <BottomSheet.Content
          backgroundClassName="bg-brand-white"
          animatedPosition={animatedPosition}
        >
          <BottomSheet.Title
            numberOfLines={1}
            className="text-lg text-brand-black"
          >
            {place?.name}
          </BottomSheet.Title>
          <Show>
            <Show.If isTrue={!!place?.address}>
              <BottomSheet.Description
                numberOfLines={1}
                className="text-sm text-black/50"
              >
                {place?.address}
              </BottomSheet.Description>
            </Show.If>
          </Show>

          <View className="mt-4 flex-row gap-3">
            <Pressable
              onPress={onClear}
              className="h-12 flex-1 items-center justify-center rounded-full bg-red-50 active:opacity-80"
            >
              <Text className="text-base text-red-600">Clear</Text>
            </Pressable>
            <Pressable
              onPress={onDirections}
              disabled={routeLoading}
              className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-brand-black active:opacity-80"
            >
              <Route size={18} color="#FFFFFF" strokeWidth={1.75} />
              <Text className="text-base text-brand-white">
                <Show>
                  <Show.If isTrue={routeLoading}>Finding…</Show.If>
                  <Show.Else>Directions</Show.Else>
                </Show>
              </Text>
            </Pressable>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

export default memo(DestinationSheet);
