import useUserLocation from "@/hooks/useUserLocation";

import { TripMap } from "../../sections/trip";

export default function TripPage() {
  // Shared with Home through LocationProvider, so the map opens on the user.
  const { userLngLat } = useUserLocation();

  return <TripMap userLngLat={userLngLat} />;
}
