import * as Location from "expo-location";
import { useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";

// Compass direction the phone is facing, in degrees from north. Held in a
// shared value so the many compass updates animate on the UI thread without
// re-rendering React. -1 until the first compass reading arrives.
export default function useHeading() {
  const heading = useSharedValue(-1);

  useEffect(() => {
    let subscription = null;
    let stopped = false;

    Location.watchHeadingAsync(({ trueHeading, magHeading }) => {
      // trueHeading is -1 when unavailable; magnetic is close enough then.
      heading.set(trueHeading >= 0 ? trueHeading : magHeading);
    })
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
  }, [heading]);

  return heading;
}
