import { Marker } from "@maplibre/maplibre-react-native";
import { MapPin } from "lucide-react-native";
import { memo } from "react";

// Red pin where the user wants to go. Anchored at the bottom so the pin's
// tip sits on the exact spot.
function DestinationMarker({ lngLat }) {
  return (
    <Marker id="destination" lngLat={lngLat} anchor="bottom">
      <MapPin size={40} color="#FFFFFF" fill="#EF4444" strokeWidth={1.5} />
    </Marker>
  );
}

export default memo(DestinationMarker);
