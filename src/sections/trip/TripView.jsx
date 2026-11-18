import { useCallback, useEffect, useRef, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DEFAULT_CENTER } from "@/constants/map";
import useRoute from "@/hooks/useRoute";
import useUserLocation from "@/hooks/useUserLocation";

import DestinationSheet from "./DestinationSheet";
import MapButtons from "./MapButtons";
import TripMap from "./TripMap";

export default function TripView() {
  const { userLngLat, locateUser, watchUser } = useUserLocation();
  const cameraRef = useRef(null);
  // { name, address, lngLat } of where the user wants to go.
  const [destination, setDestination] = useState(null);
  // When on, the map moves with the user. Off while looking at a destination.
  const [following, setFollowing] = useState(true);
  // Satellite photos (default) or the street map. Satellite shows buildings
  // OpenStreetMap hasn't mapped yet.
  const [satellite, setSatellite] = useState(true);
  const toggleSatellite = useCallback(() => setSatellite((on) => !on), []);
  const showStreetMap = useCallback(() => setSatellite(false), []);
  const insets = useSafeAreaInsets();
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

  // Locate button: centres and zooms on the user once. Doesn't turn following
  // on, so the map stays put when they move. Checks first that permission is
  // still given and the phone's location is on.
  const centerOnUser = useCallback(async () => {
    const lngLat = await locateUser();
    if (!lngLat) return null;
    cameraRef.current?.easeTo({ center: lngLat, zoom: 17, duration: 400 });
    return lngLat;
  }, [locateUser]);

  // Start: centre on the user and keep the map moving with them.
  const startFollowing = useCallback(async () => {
    if (await centerOnUser()) setFollowing(true);
  }, [centerOnUser]);

  // Long-press on the map: the user picks the exact spot by hand. Stops
  // following so the map doesn't drift back to the user.
  const handleLongPress = useCallback((lngLat) => {
    const [lng, lat] = lngLat;
    setFollowing(false);
    setDestination({
      name: "Dropped pin",
      address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      lngLat,
    });
  }, []);

  // Moving the map by hand pauses following, so GPS updates don't keep
  // pulling the map back to the user.
  const pauseFollowing = useCallback(() => setFollowing(false), []);

  // The card's X removes the pin (and with it, the route).
  const clearDestination = useCallback(() => setDestination(null), []);

  // Directions: get the road route from the user to the destination, then fit
  // the camera so all of it is visible.
  const showDirections = useCallback(async () => {
    const start = await locateUser();
    if (!start) return;
    setFollowing(false); // so following doesn't pull the camera off the route
    try {
      const route = await findRoute(start);
      // Room for the card at the bottom.
      cameraRef.current?.fitBounds(route.bounds, {
        padding: {
          top: insets.top + 50,
          bottom: insets.bottom + 200,
          left: 50,
          right: 50,
        },
        duration: 800,
      });
    } catch {
      // Android's own small message at the bottom, like "Copied".
      ToastAndroid.show("Couldn't find a route", ToastAndroid.SHORT);
    }
  }, [locateUser, findRoute, insets]);

  // The sheet writes its top edge here on every frame, and with the screen
  // height MapButtons works out how far to lift to stay above it.
  const screenHeight = useSharedValue(0);
  const sheetTop = useSharedValue(Number.MAX_SAFE_INTEGER); // closed
  const handleLayout = useCallback(
    (event) => screenHeight.set(event.nativeEvent.layout.height),
    [screenHeight],
  );

  return (
    <View className="flex-1" onLayout={handleLayout}>
      <TripMap
        cameraRef={cameraRef}
        initialCenter={initialCenter}
        destination={destination}
        route={route}
        satellite={satellite}
        onLongPress={handleLongPress}
        onShowStreetMap={showStreetMap}
        onUserMove={pauseFollowing}
      />
      <MapButtons
        satellite={satellite}
        onToggleSatellite={toggleSatellite}
        onLocate={centerOnUser}
        sheetTop={sheetTop}
        screenHeight={screenHeight}
      />
      {/* Always mounted: it opens and closes itself with `destination`. */}
      <DestinationSheet
        animatedPosition={sheetTop}
        destination={destination}
        routeLoading={routeLoading}
        onDirections={showDirections}
        onClear={clearDestination}
        // No navigation yet: Start just goes back to following the user.
        onStart={startFollowing}
      />
    </View>
  );
}
