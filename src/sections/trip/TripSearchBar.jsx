import { Search, X } from "lucide-react-native";
import { memo } from "react";
import { Pressable, TextInput, View } from "react-native";

import Show from "@/components/Show";

// Pressing the keyboard's search key just closes the keyboard (the default
// for a single-line input); results already update as you type.
function TripSearchBar({ value, onChangeText, onClear }) {
  return (
    <View className="px-3 h-16 flex-row items-center rounded-full bg-brand-white shadow-float">
      <Search size={30} color="rgba(0,0,0,0.5)" strokeWidth={1} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Where to?"
        placeholderTextColor="rgba(0,0,0,0.4)"
        returnKeyType="search"
        className="ml-3 flex-1 text-lg text-brand-black"
      />
      {/* Only shown when there's something to clear. */}
      <Show>
        <Show.If isTrue={!!value}>
          <Pressable
            onPress={onClear}
            hitSlop={8}
            accessibilityLabel="Clear search"
            className="h-10 w-10 items-center justify-center rounded-full active:bg-black/5"
          >
            <X size={22} color="rgba(0,0,0,0.5)" strokeWidth={1.5} />
          </Pressable>
        </Show.If>
      </Show>
    </View>
  );
}

export default memo(TripSearchBar);
