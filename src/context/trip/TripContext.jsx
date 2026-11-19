import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ToastAndroid } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { DEFAULT_CENTER } from "@/constants/map";
import { DEFAULT_TRAVEL_MODE } from "@/constants/travelModes";
import useRoute from "@/hooks/useRoute";
import useTripCamera from "@/hooks/useTripCamera";
import useUserLocation from "@/hooks/useUserLocation";

const TripContext = createContext(null);

// Everything the trip screen shares between the map, the map buttons and the
// sheet. Lives only while the trip screen is open, so it starts fresh each
// time. Read it with useTrip().
export function TripProvider({ children }) {
  const { userLngLat, locateUser, watchUser } = useUserLocation();
  const { cameraRef, centerOnUser, fitRoute } = useTripCamera({ locateUser });

  // Live location while this screen is open; GPS stops when it closes.
  useEffect(() => watchUser(), [watchUser]);

  // Where the map opens — read once so later GPS updates don't touch the map.
  const [initialCenter] = useState(() => userLngLat ?? DEFAULT_CENTER);

  // Satellite photos (default) or the street map.
  const [satellite, setSatellite] = useState(true);
  const toggleSatellite = useCallback(() => setSatellite((on) => !on), []);
  const showStreetMap = useCallback(() => setSatellite(false), []);

  // { name, address, lngLat } of where the user wants to go.
  const [destination, setDestination] = useState(null);

  // Long-press on the map drops a pin there.
  const dropPin = useCallback(([lng, lat]) => {
    setDestination({
      name: "Dropped pin",
      address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      lngLat: [lng, lat],
    });
  }, []);

  const clearDestination = useCallback(() => setDestination(null), []);

  // How the user travels: an ORS profile like "driving-car".
  const [mode, setMode] = useState(DEFAULT_TRAVEL_MODE);
  // 1 or 2 routes once Directions is tapped; one of them is chosen.
  const {
    routes,
    routeBounds,
    selectedRoute,
    selectRoute,
    routeLoading,
    findRoute,
  } = useRoute(destination, mode);

  // Find the routes from the user for `forMode`. The effect below fits them.
  const loadRoutes = useCallback(
    async (forMode) => {
      const start = await locateUser();
      if (!start) return;
      try {
        await findRoute(start, forMode);
      } catch {
        ToastAndroid.show("Couldn't find a route", ToastAndroid.SHORT);
      }
    },
    [locateUser, findRoute],
  );

  const showDirections = useCallback(() => loadRoutes(mode), [loadRoutes, mode]);

  // New mode: if routes are already on the map, get them for this mode too.
  const changeMode = useCallback(
    (nextMode) => {
      setMode(nextMode);
      if (routes) loadRoutes(nextMode);
    },
    [routes, loadRoutes],
  );

  // The sheet's real height, measured by the sheet itself.
  const [sheetHeight, setSheetHeight] = useState(0);

  // Show all routes above the sheet. Runs when new routes arrive and again
  // when the sheet grows to fit their chips, so the fit uses its final height.
  useEffect(() => {
    if (routeBounds) fitRoute(routeBounds, sheetHeight);
  }, [routeBounds, sheetHeight, fitRoute]);

  // The sheet writes its top edge here on every frame; with the screen height,
  // the map buttons work out how far to lift to stay above it.
  const screenHeight = useSharedValue(0);
  const sheetTop = useSharedValue(Number.MAX_SAFE_INTEGER); // closed

  const value = useMemo(
    () => ({
      // Map
      cameraRef,
      initialCenter,
      satellite,
      toggleSatellite,
      showStreetMap,
      centerOnUser,
      // Destination
      destination,
      dropPin,
      clearDestination,
      // Routes
      mode,
      changeMode,
      routes,
      selectedRoute,
      selectRoute,
      routeLoading,
      showDirections,
      // Sheet ↔ map buttons
      setSheetHeight,
      screenHeight,
      sheetTop,
    }),
    [
      cameraRef,
      initialCenter,
      satellite,
      toggleSatellite,
      showStreetMap,
      centerOnUser,
      destination,
      dropPin,
      clearDestination,
      mode,
      changeMode,
      routes,
      selectedRoute,
      selectRoute,
      routeLoading,
      showDirections,
      screenHeight,
      sheetTop,
    ],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

// Portals (like the bottom sheet's) draw their content outside TripProvider,
// so the context doesn't reach it. Read `useTrip()` outside the portal and
// wrap the portal's content in this with that value to pass it through.
export function TripPortalBridge({ value, children }) {
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used inside TripProvider");
  }
  return context;
}
