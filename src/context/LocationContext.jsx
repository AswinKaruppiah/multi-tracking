import * as Location from "expo-location";
import { createContext, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

export const LocationContext = createContext(null);

// Holds the user's location for the whole app, so every screen shares it.
// Asks for location only when locateUser is called (e.g. on "Start Trip").
export function LocationProvider({ children }) {
  // [longitude, latitude] of the user, once found.
  const [userLngLat, setUserLngLat] = useState(null);
  // True while waiting on the GPS fix, which can take a few seconds.
  const [locating, setLocating] = useState(false);

  // Resolves to [longitude, latitude], or null if location isn't available.
  async function locateUser() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      if (permission.canAskAgain) {
        Alert.alert(
          "Location needed",
          "A trip can't start without your location.",
        );
      } else {
        // "Don't ask again" was picked — only Settings can grant it now.
        Alert.alert(
          "Location is off",
          "Allow location for this app in Settings to start a trip.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
      }
      return null;
    }

    if (!(await Location.hasServicesEnabledAsync())) {
      if (Platform.OS === "android") {
        try {
          // Shows Android's in-app "Turn on location?" dialog.
          await Location.enableNetworkProviderAsync();
        } catch {
          return null;
        }
      } else {
        Alert.alert(
          "Location Services are off",
          "Turn on Location Services in Settings to start a trip.",
        );
        return null;
      }
    }

    // Already found once — the checks above confirm it still works, so no
    // need to wait on the GPS again.
    if (userLngLat) return userLngLat;

    setLocating(true);
    try {
      // The phone's cached position is instant; a fresh GPS fix can take seconds.
      const { coords } =
        (await Location.getLastKnownPositionAsync()) ??
        (await Location.getCurrentPositionAsync());
      const lngLat = [coords.longitude, coords.latitude];
      setUserLngLat(lngLat);
      return lngLat;
    } catch {
      Alert.alert("Couldn't find you", "Please try again in a moment.");
      return null;
    } finally {
      setLocating(false);
    }
  }

  return (
    <LocationContext.Provider value={{ userLngLat, locating, locateUser }}>
      {children}
    </LocationContext.Provider>
  );
}
