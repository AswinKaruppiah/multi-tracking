import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "heroui-native";
import { Keyboard, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Show from "@/components/Show";
import { DEFAULT_CENTER } from "@/constants/map";
import useRoute from "@/hooks/useRoute";
import useUserLocation from "@/hooks/useUserLocation";

import DestinationCard from "./DestinationCard";
import LocateButton from "./LocateButton";
import TripMap from "./TripMap";
import TripSearch from "./TripSearch";

export default function TripView() {
  const { userLngLat, locateUser, watchUser } = useUserLocation();
  const cameraRef = useRef(null);
  // { name, address, lngLat } of where the user wants to go.
  const [destination, setDestination] = useState(null);
  // When on, the map moves with the user. Off while looking at a destination.
  const [following, setFollowing] = useState(true);
  const insets = useSafeAreaInsets();
  const { toast } = useToast();
  // Where the map opens — read once so later GPS updates don't touch TripMap.
  const [initialCenter] = useState(() => userLngLat ?? DEFAULT_CENTER);

  // { geometry, bounds, distance, duration } once Directions is tapped.
  const { route, routeLoading, findRoute } = useRoute(destination);

  // Live location while this screen is open; GPS stops when it closes.
  useEffect(() => watchUser(), [watchUser]);

  // Follow the user: move the map with each new position. 1 s linear matches
  // UserMarker's glide, so the dot stays centred.
  useEffect(() => {
    if (!userLngLat || !following) return;
    cameraRef.current?.easeTo({
      center: userLngLat,
      duration: 1000,
      easing: "linear",
    });
  }, [userLngLat, following]);

  // Brings the map back to the user after they've panned away. Checks first
  // that permission is still given and the phone's location is on.
  const centerOnUser = useCallback(async () => {
    const lngLat = await locateUser();
    if (!lngLat) return;
    setFollowing(true);
    cameraRef.current?.easeTo({ center: lngLat, zoom: 15, duration: 400 });
  }, [locateUser]);

  // Save the place and drop the pin. Stops following so the map doesn't
  // drift back to the user.
  const goTo = useCallback((place) => {
    Keyboard.dismiss();
    setFollowing(false);
    setDestination(place);
  }, []);

  // Picked from search: the place may be off screen, so pan the map to it
  // (same zoom). Long-press doesn't move — that spot is already in view.
  const handleSelect = useCallback(
    (place) => {
      goTo(place);
      cameraRef.current?.easeTo({ center: place.lngLat, duration: 600 });
    },
    [goTo],
  );

  // Long-press on the map: the user picks the exact spot by hand.
  const handleLongPress = useCallback(
    (lngLat) => {
      const [lng, lat] = lngLat;
      goTo({
        name: "Dropped pin",
        address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lngLat,
      });
    },
    [goTo],
  );

  // Typing pauses following, so GPS updates don't keep pulling the map back
  // to the user while they search.
  const pauseFollowing = useCallback(() => setFollowing(false), []);

  // The search bar's X removes the pin (and with it, the route).
  const clearDestination = useCallback(() => setDestination(null), []);

  // Directions: get the road route from the user to the destination, then fit
  // the camera so all of it is visible.
  const showDirections = useCallback(async () => {
    const start = await locateUser();
    if (!start) return;
    setFollowing(false); // so following doesn't pull the camera off the route
    try {
      const route = await findRoute(start);
      // Room for the search bar on top and the card at the bottom.
      cameraRef.current?.fitBounds(route.bounds, {
        padding: {
          top: insets.top + 110,
          bottom: insets.bottom + 200,
          left: 50,
          right: 50,
        },
        duration: 800,
      });
    } catch {
      toast.show({
        variant: "danger",
        label: "Couldn't find a route",
        description: "Check your connection and try again.",
      });
    }
  }, [locateUser, findRoute, insets, toast]);

  return (
    <View className="flex-1">
      <TripMap
        cameraRef={cameraRef}
        initialCenter={initialCenter}
        destination={destination}
        route={route}
        onLongPress={handleLongPress}
      />
      <TripSearch
        destination={destination}
        near={userLngLat}
        onSelect={handleSelect}
        onClear={clearDestination}
        onType={pauseFollowing}
      />
      <LocateButton onPress={centerOnUser} raised={!!destination} />
      <Show>
        <Show.If isTrue={!!destination}>
          <DestinationCard
            destination={destination}
            routeLoading={routeLoading}
            onDirections={showDirections}
            // No navigation yet: Start just goes back to following the user.
            onStart={centerOnUser}
          />
        </Show.If>
      </Show>
    </View>
  );
}
