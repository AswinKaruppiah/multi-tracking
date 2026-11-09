import { useEffect, useRef, useState } from "react";

import useDebounce from "./useDebounce";

// Photon: free OpenStreetMap place search, made for search-as-you-type.
const PHOTON_URL = "https://photon.komoot.io/api/";
const MIN_LETTERS = 3;
const WAIT_MS = 400;

// Turns a Photon result into { id, name, address, lngLat }.
function toPlace(feature) {
  const p = feature.properties;
  const street = [p.housenumber, p.street].filter(Boolean).join(" ");
  const address = [street, p.district, p.city, p.state, p.country]
    .filter(Boolean)
    .filter((part) => part !== p.name)
    .join(", ");

  return {
    id: `${p.osm_type}${p.osm_id}`,
    name: p.name || street || "Unnamed place",
    address,
    lngLat: feature.geometry.coordinates,
  };
}

// Searches places as the user types. `near` ([lng, lat]) puts nearby places
// first. Waits until typing pauses, and drops answers to older searches.
export default function usePlaceSearch(query, near) {
  const text = query.trim();
  const active = text.length >= MIN_LETTERS;
  // The latest answer, and the text it answers.
  const [answer, setAnswer] = useState({ text: "", results: [] });

  // Read through a ref: the user's position changes every second, and that
  // alone shouldn't start a new search.
  const nearRef = useRef(near);
  useEffect(() => {
    nearRef.current = near;
  }, [near]);

  // Only search once the user pauses typing.
  const searchText = useDebounce(text, WAIT_MS);

  useEffect(() => {
    if (searchText.length < MIN_LETTERS) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ q: searchText, limit: "6" });
    if (nearRef.current) {
      params.set("lon", String(nearRef.current[0]));
      params.set("lat", String(nearRef.current[1]));
    }

    fetch(`${PHOTON_URL}?${params}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) =>
        setAnswer({ text: searchText, results: data.features.map(toPlace) }),
      )
      .catch(() => {
        // Aborted (user kept typing) or offline: show nothing.
        if (!controller.signal.aborted) {
          setAnswer({ text: searchText, results: [] });
        }
      });

    return () => controller.abort();
  }, [searchText]);

  return {
    results: active ? answer.results : [],
    // Still waiting for an answer to what's typed now.
    loading: active && answer.text !== text,
  };
}
