import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { searchTours } from "../services/apiService";

const SearchForm = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cancelTokenRef = useRef(null);

  const fetchAutocompleteSuggestions = useCallback(
    debounce(async (term) => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel(
          "New request triggered, canceling the previous one."
        );
      }

      try {
        const { data, axiosCancelToken } = await searchTours(term, token);
        setAutocompleteResults(data.destinations);
        cancelTokenRef.current = axiosCancelToken;
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Error fetching autocomplete suggestions.");
        }
      }
    }, 300),
    [token]
  );

  useEffect(() => {
    if (searchTerm) {
      fetchAutocompleteSuggestions(searchTerm);
    } else {
      setAutocompleteResults([]);
      setSearchResults([]); // Reset search results when search term is cleared
    }
  }, [searchTerm, fetchAutocompleteSuggestions]);

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
        setSearchResults([selectedDestination]);
      } else {
        const { data, axiosCancelToken } = await searchTours(searchTerm, token);
        setSearchResults(data.destinations || []);
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

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion.destinationName);
    setSelectedDestination(suggestion); // Set the selected destination
    setAutocompleteResults([]);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Search for Tours</h2>
      <form onSubmit={handleSubmit} aria-label="Search for tours form">
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="search">
            Search for a place
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedDestination(null); // Reset selected destination
            }}
            placeholder="e.g Lagos, Nigeria"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {autocompleteResults.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto">
              {autocompleteResults.map((suggestion) => (
                <li
                  key={suggestion.dbid}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {`${suggestion.destinationName} - ${suggestion.destinationType}`}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Search for tours
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Search Results</h3>
        <ul>
          {searchResults.map((dest) => (
            <li key={dest.destinationId}>
              <strong>{dest.destinationName}</strong> - {dest.destinationType}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

SearchForm.propTypes = {
  token: PropTypes.string.isRequired,
};

export default SearchForm;
