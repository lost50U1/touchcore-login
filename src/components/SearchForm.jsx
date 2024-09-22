// SearchForm.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash"; // Import debounce from lodash
import { searchTours } from "../services/apiService";

const SearchForm = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchResults, setSearchResults] = useState({
    destinations: [],
    products: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelTokenRef = useRef(null); // For canceling requests

  // Debounced function to handle search API calls
  const fetchSearchResults = useCallback(
    debounce(async (term) => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel(
          "New request triggered, canceling the previous one."
        );
      }
      setIsLoading(true);
      setError(null);

      try {
        const { data, axiosCancelToken } = await searchTours(term, token);
        setSearchResults({
          destinations: data.destinations,
          products: data.products,
        });
        cancelTokenRef.current = axiosCancelToken;
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          setError("Error fetching search results. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }, 300), // Delay by 300ms
    [token]
  );

  // Handle input change and trigger the autocomplete API call with debounce
  useEffect(() => {
    if (searchTerm) {
      fetchSearchResults(searchTerm);
    } else {
      setSearchResults({ destinations: [], products: [] }); // Clear results if input is empty
    }
  }, [searchTerm, fetchSearchResults]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Search for Tours</h2>
      <form onSubmit={handleSubmit} aria-label="Search for tours form">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="search">
            Search for a place or activity
          </label>
          <input
            type="text"
            id="search"
            aria-label="Search input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g Lagos, Nigeria"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
