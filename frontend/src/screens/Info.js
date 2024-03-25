import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function Info() {
  const [searchAd, setSearchedAd] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  let params = useParams();

  const getSearch = (e) => {
    axios
      .get("http://localhost:10000/info/" + params.term + "/" + params.id)
      .then(function (response) {
        console.log(response);
        setSearchedAd(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  useEffect(() => {
    getSearch(params.term);
  }, [params.term]);

  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <ClipLoader color="#36d7b7" />
    </div>
  ) : !searchAd ? (
    <div className="flex items-center justify-center h-screen">
      <div className="text-4xl">Error Finding posting</div>
    </div>
  ) : (
    <>
      <div className=" text-lime-800 py-6">
        <div className="container mx-auto text-center">
          {searchAd.title && (
            <h1 className="text-4xl font-bold cursive-font">
              {searchAd.title}
            </h1>
          )}
        </div>
      </div>
      <div className="container mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg">
        {/* Ad Image */}
        {searchAd.images && searchAd.images[0] && (
          <img
            src={searchAd.images[0]}
            alt="Ad"
            className="w-full h-64 object-contain rounded-full mb-6"
          />
        )}

        {/* Ad Description */}
        <div className="mb-6 ">
          <h2 className="text-2xl font-bold text-lime-800">Ad Description</h2>
          <p className="text-gray-600">{searchAd.description}</p>
        </div>

        {/* Ad Location */}
        {searchAd.location && (
          <div className="mb-6 ">
            <h2 className="text-2xl font-bold text-lime-800">Location</h2>
            <p className="text-gray-600">{searchAd.location} </p>
          </div>
        )}

        {/* Contact Info */}
        {params.term === "byWanted" && searchAd.buyer && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-lime-800">Contact Info</h2>
            <ul className="list-disc list-inside text-gray-600">
              {Object.entries(searchAd.buyer).map(([key, value], index) => (
                <li key={index}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>
        )}
        {params.term !== "byWanted" && searchAd.seller && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-lime-800">Contact Info</h2>
            <ul className="list-disc list-inside text-gray-600">
              {Object.entries(searchAd.seller).map(([key, value], index) => (
                <li key={index}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ad Condition */}
        {searchAd.condition && (
          <div className="mb-6 ">
            <h2 className="text-2xl font-bold text-lime-800">Condition</h2>
            <p className="text-gray-600">{searchAd.condition} </p>
          </div>
        )}

        {/* Ad Category */}
        {searchAd.category && (
          <div className="mb-6 ">
            <h2 className="text-2xl font-bold text-lime-800">Category</h2>
            <p className="text-gray-600">{searchAd.category} </p>
          </div>
        )}

        {/* Ad PostedAt */}
        {searchAd.postedAt && (
          <div className="mb-6 ">
            <h2 className="text-2xl font-bold text-lime-800">Posted</h2>
            <p className="text-gray-600">{searchAd.postedAt} </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Info;
