import React, { useState } from "react";

function PriceFilter({ onFilter }) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onFilter prop function, passing the min and max price
    onFilter(minPrice, maxPrice);
  };

  const handleReset = () => {
    // Reset the min and max price states
    setMinPrice("");
    setMaxPrice("");
    // Optionally, call the onFilter prop function to reset the filtered list
    onFilter("", "");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-5">
      <div>
        <label
          htmlFor="minPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Min Price
        </label>
        <input
          type="number"
          id="minPrice"
          name="minPrice"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="0"
        />
      </div>
      <div>
        <label
          htmlFor="maxPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Max Price
        </label>
        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="500"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Filter
      </button>
      <button
        type="button" // Ensure this is a "button" to prevent form submission
        onClick={handleReset}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Reset
      </button>
    </form>
  );
}

export default PriceFilter;
