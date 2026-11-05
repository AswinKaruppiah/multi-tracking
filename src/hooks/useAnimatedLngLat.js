import { useEffect, useRef, useState } from "react";

// Glides from the last shown [lng, lat] to `target` over `duration` ms instead
// of jumping. A new target mid-glide continues from wherever the dot is now.
export default function useAnimatedLngLat(target, duration = 1000) {
  const [current, setCurrent] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const from = currentRef.current;

    // Nothing to glide from (first fix) or to (location lost) — jump.
    if (!from || !target) {
      currentRef.current = target;
      setCurrent(target);
      return;
    }

    const start = performance.now();
    let frame;

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const next = [
        from[0] + (target[0] - from[0]) * t,
        from[1] + (target[1] - from[1]) * t,
      ];
      currentRef.current = next;
      setCurrent(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return current;
}
