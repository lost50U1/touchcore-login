import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { searchTours } from "../services/apiService";

const SearchForm = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Input field value
  const [selectedDate, setSelectedDate] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState([]); // Autocomplete suggestions
  const [selectedDestination, setSelectedDestination] = useState(null); // Store selected destination
  const [searchResults, setSearchResults] = useState({
    destinations: [],
    products: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelTokenRef = useRef(null);

  // Debounced function to fetch autocomplete suggestions
  const fetchAutocompleteSuggestions = useCallback(
    debounce(async (term) => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel(
          "New request triggered, canceling the previous one."
        );
      }

      try {
        const { data, axiosCancelToken } = await searchTours(term, token);
        setAutocompleteResults(data.destinations); // Set autocomplete suggestions
        cancelTokenRef.current = axiosCancelToken;
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Error fetching autocomplete suggestions.");
        }
      }
    }, 300),
    [token]
  );

  // Handle input change and fetch autocomplete suggestions
  useEffect(() => {
    if (searchTerm) {
      fetchAutocompleteSuggestions(searchTerm);
    } else {
      setAutocompleteResults([]); // Clear suggestions if input is empty
    }
  }, [searchTerm, fetchAutocompleteSuggestions]);

  // Handle final search when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel(
        "New request triggered, canceling the previous one."
      );
    }

    setIsLoading(true);
    setError(null);

    try {
      if (selectedDestination) {
        // Use the selected destination's details for the final search
        setSearchResults({
          destinations: [selectedDestination],
          products: selectedDestination.products || [],
        });
      } else {
        // Perform regular search with the input search term
        const { data, axiosCancelToken } = await searchTours(searchTerm, token);
        setSearchResults({
          destinations: data.destinations,
          products: data.products,
        });
        cancelTokenRef.current = axiosCancelToken;
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError("Error fetching search results. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting an autocomplete suggestion
  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion.name); // Fill input with selected destination name
    setSelectedDestination(suggestion); // Store selected destination object
    setAutocompleteResults([]); // Hide autocomplete after selection
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Search for Tours</h2>
      <form onSubmit={handleSubmit} aria-label="Search for tours form">
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="search">
            Search for a place or activity
          </label>
          <input
            type="text"
            id="search"
            aria-label="Search input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedDestination(null); // Reset selected destination when typing
            }}
            placeholder="e.g Lagos, Nigeria"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* Autocomplete dropdown */}
          {autocompleteResults.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto">
              {autocompleteResults.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {suggestion.name} - {suggestion.tags.join(", ")}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="date">
            When
          </label>
          <input
            type="date"
            id="date"
            aria-label="Date input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Search for tours button"
        >
          Search for tours
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Search Results</h3>
        <ul>
          {searchResults.destinations.map((dest, index) => (
            <li key={index}>
              <strong>{dest.name}</strong>
              <span> - {dest.tags.join(", ")}</span>
              <ul>
                {dest.products &&
                  dest.products.length > 0 &&
                  dest.products.map((product, idx) => (
                    <li key={idx}>Product: {product.name}</li>
                  ))}
              </ul>
            </li>
          ))}
          {searchResults.products.map((product, index) => (
            <li key={index}>{product.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchForm;
