import React from "react";
import { useNavigate } from "react-router-dom";

function ExploreCard({ title, subTitle, img, adID }) {
  const navigate = useNavigate();
  return (
    <div className="max-w-[22rem] bg-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 mx-2 my-8">
      <img
        className="w-full h-[16rem] object-cover rounded-t-2xl"
        src={img}
        alt={title}
      />
      <div className="bg-blue-50 p-4">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600">{subTitle}</p>
        <div className="flex justify-start mt-4">
          <button
            onClick={() => navigate("/info/" + adID)}
            className="bg-blue-800  text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExploreCard;
