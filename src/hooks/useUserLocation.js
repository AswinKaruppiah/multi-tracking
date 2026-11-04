import { useContext } from "react";

import { LocationContext } from "@/context/LocationContext";

// { userLngLat, locating, locateUser } — shared across all screens.
export default function useUserLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useUserLocation must be used inside LocationProvider");
  }
  return context;
}
