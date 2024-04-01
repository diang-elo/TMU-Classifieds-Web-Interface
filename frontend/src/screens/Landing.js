import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExploreCard from "../components/cards/ExploreCard";
import ItemCard from "../components/cards/ItemCard";

export default function Landing() {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("bySale");
  const [searchResults, setSearchResults] = useState([]);

  const getSearch = async (searchNameText) => {
    try {
      const response = await axios.get(
        `http://localhost:10000/search/${searchType}/${searchNameText}`,
        { timeout: 5000 }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAd = (e) => {
    e.preventDefault();

    if (searchType === "byWanted") {
      navigate("/ads/" + "byWanted=" + searchName);
    } else if (searchType === "bySale") {
      navigate("/ads/" + "bySale=" + searchName);
    } else if (searchType === "byService") {
      navigate("/ads/" + "byService=" + searchName);
    }
  };

  const handleSelectItem = (search) => {
    if (searchType === "byWanted") {
      navigate("/ads/" + "byWanted=" + search);
    } else if (searchType === "bySale") {
      navigate("/ads/" + "bySale=" + search);
    } else if (searchType === "byService") {
      navigate("/ads/" + "byService=" + search);
    }
  };

  return (
    <div>
      <div className="grid place-items-center h-screen">
        <h1 className="mb-4 text-6xl font-bold text-gray-900 cursive-font">
          TMU Classifieds Web Interface
        </h1>
        <form className="sm:w-3/5 w-80 relative" autoComplete="off">
          <label
            htmlFor="search-type"
            className="mb-2 text-sm font-medium text-gray-900 sr-only"
          >
            Search
          </label>
          <div className="flex">
            <select
              id="search-type"
              onChange={(event) => {
                setSearchType(event.target.value);
              }}
              className="block p-4 pr-8 text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500"
            >
              <option value="bySale">Items for Sale</option>
              <option value="byWanted">Items Wanted</option>
              <option value="byService">Academic Services</option>
            </select>
            <input
              onChange={(event) => {
                setSearchName(event.target.value);
                getSearch(event.target.value);
              }}
              type="search"
              id="default-search"
              className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50  border border-gray-300 focus:ring-blue-500"
              placeholder="Search Ingredient"
              value={searchName}
            />
            <button
              onClick={getAd}
              type="submit"
              className="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-900 font-medium rounded-r-lg text-sm px-4 py-2"
            >
              Search
            </button>
          </div>
          {/* Display the search results as a menu */}
          {searchResults.length > 0 && searchName && (
            <ul className="absolute z-10 mt-2 bg-white border border-gray-300 divide-y divide-gray-200 rounded-md shadow-lg w-full">
              {searchResults.map((result) => (
                <li
                  key={result._id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectItem(result.title)}
                >
                  {result.title}
                </li>
              ))}
            </ul>
          )}
        </form>

        <div className="flex justify-center">
          <ExploreCard
            title="MackBook Pro (New)"
            img="https://cdn.mos.cms.futurecdn.net/GfinEMFXnT42BFxAcDc2rA.jpg"
            recipeID={10}
            subTitle={
              "8 cores, intel chip, 256 GB SSD, bought 2020. Msg for more info"
            }
            navigateTo={"/ads/bySale="}
          />
          <ExploreCard
            title="TMU Merch Wanted"
            img="https://campusstore.torontomu.ca/images/product/medium/26392.jpg"
            recipeID={22}
            subTitle={
              "Looking for any used TMU merched. Will take any size. Need for art project."
            }
            navigateTo={"/ads/byWanted="}
          />
          <ExploreCard
            title="Computer Science Tutor"
            img="https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg"
            recipeID={11}
            subTitle={"CS graduate offering services for tutoring"}
            navigateTo={"/ads/byService="}
          />
        </div>
      </div>
    </div>
  );
}
