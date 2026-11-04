import { Search } from "lucide-react-native";
import { TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TripSearchBar({ value, onChangeText, onSubmit }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-5 right-5 px-3 h-16 flex-row items-center rounded-full bg-brand-white"
      style={{ top: insets.top + 12 }}
    >
      <Search size={30} color="rgba(0,0,0,0.5)" strokeWidth={1} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder="Where to?"
        placeholderTextColor="rgba(0,0,0,0.4)"
        returnKeyType="search"
        className="ml-3 flex-1 text-lg text-brand-black"
      />
    </View>
  );
}
