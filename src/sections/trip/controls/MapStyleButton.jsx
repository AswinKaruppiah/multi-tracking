import { Layers, Map as MapIcon } from "lucide-react-native";
import { memo } from "react";
import { Pressable } from "react-native";

// Switches between the street map and satellite photos.
function MapStyleButton({ satellite, onPress }) {
  const Icon = satellite ? MapIcon : Layers;
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={satellite ? "Show street map" : "Show satellite view"}
      className="h-12 w-12 items-center justify-center rounded-full bg-white active:opacity-80"
    >
      <Icon size={22} color="rgba(0,0,0,0.5)" strokeWidth={2} />
    </Pressable>
  );
}

export default memo(MapStyleButton);
