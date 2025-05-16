import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDollarSign, faMapMarkerAlt, faStar, faTimes } from '@fortawesome/free-solid-svg-icons';

const Filter = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");

  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onFilter({ searchTerm, budget, location, rating });
    }, 500); // Adjust delay as needed

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, budget, location, rating, onFilter]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    setBudget("");
    setLocation("");
    setRating("");
    onFilter({});
  }, [onFilter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#1d5ec7] mt-11">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Institutes</h3>
      
      <form className="space-y-6">
        {/* Search Field */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Institutes or Courses
          </label>
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter name or course"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#1d5ec7] focus:border-[#1d5ec7d0] text-sm"
            />
          </div>
        </div>

        {/* Budget Dropdown */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget
          </label>
          <div className="relative">
            <FontAwesomeIcon icon={faDollarSign} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#1d5ec7] focus:border-[#1d5ec7d0] text-sm appearance-none"
            >
              <option value="">Select Budget</option>
              <option value="low">Below 100,000</option>
              <option value="medium">100,000 - 200,000</option>
              <option value="high">Above 200,000</option>
            </select>
          </div>
        </div>

        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or State"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#1d5ec7] focus:border-[#1d5ec7d0] text-sm"
            />
          </div>
        </div>

        {/* Rating Dropdown */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Rating
          </label>
          <div className="relative">
            <FontAwesomeIcon icon={faStar} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#1d5ec7] focus:border-[#1d5ec7d0] text-sm appearance-none"
            >
              <option value="">Select Rating</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars & Above</option>
              <option value="3">3 Stars & Above</option>
              <option value="2">2 Stars & Above</option>
            </select>
          </div>
        </div>

        {/* Clear All Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default Filter;
