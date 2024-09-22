import { useState } from "react";

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
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
            required
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
    </div>
  );
};

export default SearchForm;
