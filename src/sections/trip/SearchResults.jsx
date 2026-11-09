import { MapPin } from "lucide-react-native";
import { memo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import Show from "@/components/Show";

// The list of places under the search bar.
function SearchResults({ results, loading, onSelect }) {
  return (
    <View className="max-h-80 overflow-hidden rounded-3xl bg-brand-white shadow-float">
      <Show>
        <Show.If isTrue={loading}>
          <Text className="px-5 py-4 text-base text-black/50">Searching…</Text>
        </Show.If>
        <Show.ElseIf isTrue={results.length === 0}>
          <Text className="px-5 py-4 text-base text-black/50">
            No places found
          </Text>
        </Show.ElseIf>
        <Show.Else>
          <ScrollView keyboardShouldPersistTaps="handled">
            {results.map((place) => (
              <Pressable
                key={place.id}
                onPress={() => onSelect(place)}
                className="flex-row items-center px-4 py-3 active:bg-black/5"
              >
                <MapPin size={20} color="rgba(0,0,0,0.5)" strokeWidth={1.5} />
                <View className="ml-3 flex-1">
                  <Text
                    numberOfLines={1}
                    className="text-base text-brand-black"
                  >
                    {place.name}
                  </Text>
                  <Show>
                    <Show.If isTrue={!!place.address}>
                      <Text numberOfLines={1} className="text-sm text-black/50">
                        {place.address}
                      </Text>
                    </Show.If>
                  </Show>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Show.Else>
      </Show>
    </View>
  );
}

export default memo(SearchResults);
