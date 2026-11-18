import { memo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, Path, RadialGradient, Stop } from "react-native-svg";

// Beam box size; UserMarker's wrapper must match so the dot sits at its centre.
export const BEAM_SIZE = 150;

const C = BEAM_SIZE / 2; // centre = where the dot is
const R = 70; // beam length — keep under BEAM_SIZE / 2
const HALF_ANGLE = (45 * Math.PI) / 180; // 90° wide fan

// Fan from the centre, pointing up (north) before rotation.
const left = [C - R * Math.sin(HALF_ANGLE), C - R * Math.cos(HALF_ANGLE)];
const right = [C + R * Math.sin(HALF_ANGLE), C - R * Math.cos(HALF_ANGLE)];
const BEAM_PATH = `M${C} ${C} L${left[0]} ${left[1]} A${R} ${R} 0 0 1 ${right[0]} ${right[1]} Z`;

// Google-Maps-style "flashlight" showing which way the phone faces. `heading`
// (compass) and `bearing` (map rotation) are shared values, so it turns on the
// UI thread with no React re-renders.
function HeadingCone({ heading, bearing }) {
  const angle = useSharedValue(0);
  // Hidden until the compass sends its first reading (~1 s after opening),
  // so the beam never shows pointing north and then spinning round.
  const ready = useSharedValue(false);

  useAnimatedReaction(
    () => (heading.get() < 0 ? null : heading.get() - bearing.get()),
    (target) => {
      if (target === null) return;

      // First reading: point straight at it, no spin from 0°.
      if (!ready.get()) {
        angle.set(target);
        ready.set(true);
        return;
      }

      const current = angle.get();
      // Turn the short way round: 350° → 10° is +20°, not -340°.
      const delta = ((((target - current) % 360) + 540) % 360) - 180;
      angle.set(withTiming(current + delta, { duration: 200 }));
    },
  );

  const rotation = useAnimatedStyle(() => ({
    opacity: withTiming(ready.get() ? 1 : 0, { duration: 150 }),
    transform: [{ rotate: `${angle.get()}deg` }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.container, rotation]}>
      <Svg width={BEAM_SIZE} height={BEAM_SIZE}>
        <Defs>
          {/* Strong next to the dot, fading to nothing at the tip. */}
          <RadialGradient
            id="beam"
            cx={C}
            cy={C}
            r={R}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#3B82F6" stopOpacity={0.55} />
            <Stop offset="1" stopColor="#3B82F6" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Path d={BEAM_PATH} fill="url(#beam)" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Fixed size (not absoluteFill) so the beam's centre is always the box centre.
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: BEAM_SIZE,
    height: BEAM_SIZE,
  },
});

export default memo(HeadingCone);
