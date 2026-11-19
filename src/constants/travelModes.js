import { Bike, Car, Footprints } from "lucide-react-native";

// Ways to travel, each mapped to an OpenRouteService profile. ORS has no
// motorbike profile, so bikes share the car one (same roads).
export const TRAVEL_MODES = [
  { id: "driving-car", label: "Car / Bike", Icon: Car },
  { id: "cycling-regular", label: "Cycle", Icon: Bike },
  { id: "foot-walking", label: "Walk", Icon: Footprints },
];

export const DEFAULT_TRAVEL_MODE = TRAVEL_MODES[0].id;
