import { useEffect, useState } from "react";

// Returns `value`, but only once it has stopped changing for `delay` ms.
// e.g. search text: wait until the user pauses typing before searching.
export default function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
