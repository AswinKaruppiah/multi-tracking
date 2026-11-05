import * as Location from "expo-location";
import { useToast } from "heroui-native";
import { createContext, useCallback, useState } from "react";
import { Linking, Platform } from "react-native";

export const LocationContext = createContext(null);

// Holds the user's location for the whole app, so every screen shares it.
// Asks for location only when locateUser is called (e.g. on "Start Trip").
export function LocationProvider({ children }) {
  // [longitude, latitude] of the user, once found.
  const [userLngLat, setUserLngLat] = useState(null);
  // True while waiting on the GPS fix, which can take a few seconds.
  const [locating, setLocating] = useState(false);
  const { toast } = useToast();

  // Keeps userLngLat live as the user moves. Returns a function that stops it,
  // so a screen can use it directly as its effect: useEffect(() => watchUser(), []).
  const watchUser = useCallback(() => {
    let subscription = null;
    let stopped = false;

    Location.watchPositionAsync(
      // New position after moving 5 m — no jitter while standing still.
      { accuracy: Location.Accuracy.High, distanceInterval: 5 },
      ({ coords }) => setUserLngLat([coords.longitude, coords.latitude]),
    )
      .then((sub) => {
        // The screen may have closed before watching started.
        if (stopped) sub.remove();
        else subscription = sub;
      })
      .catch(() => {});

    return () => {
      stopped = true;
      subscription?.remove();
    };
  }, []);

  // Resolves to [longitude, latitude], or null if location isn't available.
  async function locateUser() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      if (permission.canAskAgain) {
        toast.show({
          variant: "warning",
          label: "Location needed",
          description: "A trip can't start without your location.",
        });
      } else {
        // "Don't ask again" was picked — only Settings can grant it now.
        toast.show({
          variant: "danger",
          label: "Location is off",
          description:
            "Allow location for this app in Settings to start a trip.",
          actionLabel: "Settings",
          onActionPress: ({ hide }) => {
            hide();
            Linking.openSettings();
          },
        });
      }
      return null;
    }

    const isPrecise =
      Platform.OS === "ios"
        ? permission.ios?.accuracy === "full"
        : Platform.OS === "android"
          ? permission.android?.accuracy === "fine"
          : true;

    if (!isPrecise) {
      setUserLngLat(null);
      toast.show({
        variant: "warning",
        label: "Precise location needed",
        description:
          'Turn on "Use precise location" in Settings to start a trip.',
        actionLabel: "Settings",
        onActionPress: ({ hide }) => {
          hide();
          Linking.openSettings();
        },
      });
      return null;
    }

    if (!(await Location.hasServicesEnabledAsync())) {
      if (Platform.OS === "android") {
        try {
          // Shows Android's in-app "Turn on location?" dialog.
          await Location.enableNetworkProviderAsync();
        } catch {
          toast.show({
            variant: "warning",
            label: "Location is off",
            description: "Turn on location to start a trip.",
          });
          return null;
        }
      } else {
        toast.show({
          variant: "warning",
          label: "Location Services are off",
          description: "Turn on Location Services in Settings to start a trip.",
        });
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
      toast.show({
        variant: "danger",
        label: "Couldn't find you",
        description: "Please try again in a moment.",
      });
      return null;
    } finally {
      setLocating(false);
    }
  }

  return (
    <LocationContext.Provider
      value={{ userLngLat, locating, locateUser, watchUser }}
    >
      {children}
    </LocationContext.Provider>
  );
}
