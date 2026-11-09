import { memo, useState } from "react";
import { View } from "react-native";

import Show from "@/components/Show";
import usePlaceSearch from "@/hooks/usePlaceSearch";

import SearchResults from "./SearchResults";
import TripSearchBar from "./TripSearchBar";

// Search bar + results list. Owns everything about searching; the parent only
// hears about the outcome: a place picked, the search cleared, or typing.
function TripSearch({ destination, near, onSelect, onClear, onType }) {
  const [query, setQuery] = useState("");
  // Open while typing, closed once a place is picked.
  const [showResults, setShowResults] = useState(false);
  const { results, loading } = usePlaceSearch(query, near);

  // A pin dropped on the map while the list is open closes it too.
  const [prevDestination, setPrevDestination] = useState(destination);
  if (destination !== prevDestination) {
    setPrevDestination(destination);
    setShowResults(false);
  }

  const handleChangeText = (text) => {
    setQuery(text);
    setShowResults(true);
    onType();
  };

  const handleSelect = (place) => {
    setShowResults(false);
    onSelect(place);
  };

  const handleClear = () => {
    setQuery("");
    setShowResults(false);
    onClear();
  };

  return (
    // Bar and results stacked together, so the list always sits right under
    // the bar.
    <View className="absolute left-5 right-5 top-safe-offset-4 gap-2">
      <TripSearchBar
        // While searching show what's typed; otherwise the destination's name.
        value={showResults ? query : (destination?.name ?? "")}
        onChangeText={handleChangeText}
        onClear={handleClear}
      />
      <Show>
        <Show.If isTrue={showResults && query.trim().length >= 3}>
          <SearchResults
            results={results}
            loading={loading}
            onSelect={handleSelect}
          />
        </Show.If>
      </Show>
    </View>
  );
}

export default memo(TripSearch);
