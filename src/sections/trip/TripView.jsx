import { useCallback, useEffect, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { DEFAULT_CENTER } from "@/constants/map";
import useRoute from "@/hooks/useRoute";
import useTripCamera from "@/hooks/useTripCamera";
import useUserLocation from "@/hooks/useUserLocation";

import DestinationSheet from "./sheet/DestinationSheet";
import MapButtons from "./controls/MapButtons";
import TripMap from "./map/TripMap";

export default function TripView() {
  const { userLngLat, locateUser, watchUser } = useUserLocation();
  const { cameraRef, centerOnUser, fitRoute } = useTripCamera({ locateUser });

  // { name, address, lngLat } of where the user wants to go.
  const [destination, setDestination] = useState(null);
  // { geometry, bounds, distance, duration } once Directions is tapped.
  const { route, routeLoading, findRoute } = useRoute(destination);

  // Satellite photos (default) or the street map.
  const [satellite, setSatellite] = useState(true);
  const toggleSatellite = useCallback(() => setSatellite((on) => !on), []);
  const showStreetMap = useCallback(() => setSatellite(false), []);

  // Where the map opens — read once so later GPS updates don't touch TripMap.
  const [initialCenter] = useState(() => userLngLat ?? DEFAULT_CENTER);

  // The sheet writes its top edge here on every frame; with the screen height,
  // MapButtons works out how far to lift to stay above it.
  const screenHeight = useSharedValue(0);
  const sheetTop = useSharedValue(Number.MAX_SAFE_INTEGER); // closed
  const handleLayout = useCallback(
    (event) => screenHeight.set(event.nativeEvent.layout.height),
    [screenHeight],
  );

  // Live location while this screen is open; GPS stops when it closes.
  useEffect(() => watchUser(), [watchUser]);

  // Long-press on the map drops a pin there.
  const dropPin = useCallback(([lng, lat]) => {
    setDestination({
      name: "Dropped pin",
      address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      lngLat: [lng, lat],
    });
  }, []);

  const clearDestination = useCallback(() => setDestination(null), []);

  // Directions: find the road route from the user and show all of it.
  const showDirections = useCallback(async () => {
    const start = await locateUser();
    if (!start) return;
    try {
      fitRoute((await findRoute(start)).bounds);
    } catch {
      ToastAndroid.show("Couldn't find a route", ToastAndroid.SHORT);
    }
  }, [locateUser, findRoute, fitRoute]);

  return (
    <View className="flex-1" onLayout={handleLayout}>
      <TripMap
        cameraRef={cameraRef}
        initialCenter={initialCenter}
        destination={destination}
        route={route}
        satellite={satellite}
        onLongPress={dropPin}
        onShowStreetMap={showStreetMap}
      />
      <MapButtons
        satellite={satellite}
        onToggleSatellite={toggleSatellite}
        onLocate={centerOnUser}
        sheetTop={sheetTop}
        screenHeight={screenHeight}
      />
      <DestinationSheet
        animatedPosition={sheetTop}
        destination={destination}
        routeLoading={routeLoading}
        onDirections={showDirections}
        onClear={clearDestination}
      />
    </View>
  );
}
