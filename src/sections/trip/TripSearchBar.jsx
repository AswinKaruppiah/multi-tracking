import { Search } from "lucide-react-native";
import { TextInput, View } from "react-native";

export default function TripSearchBar({ value, onChangeText, onSubmit }) {
  return (
    <View className="absolute left-5 right-5 top-safe-offset-8 px-3 h-16 flex-row items-center rounded-full bg-brand-white shadow-float">
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
