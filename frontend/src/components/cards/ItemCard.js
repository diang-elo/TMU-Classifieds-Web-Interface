import React from "react";
import { useNavigate } from "react-router-dom";

function ItemCard({
  id,
  imageUrl,
  title,
  description,
  price,
  condition,
  type,
}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/adsInfo/${id}/${type}`)}
      className="cursor-pointer max-w-xl mx-auto bg-white rounded-xl overflow-hidden shadow-md flex transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
      style={{ height: "250px" }} // Fixed height
    >
      <div className="w-1/3 h-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={imageUrl}
          alt={title}
        />
      </div>
      <div className="w-2/3 px-6 py-4 flex flex-col justify-between">
        <div>
          <div className="font-bold text-xl mb-2 overflow-hidden text-overflow-ellipsis whitespace-nowrap">
            {title}
          </div>
          <p
            className="text-gray-700 text-base overflow-hidden text-overflow-ellipsis"
            style={{ maxHeight: "4.5rem", overflow: "hidden" }}
          >
            {description}
          </p>
        </div>
        <div>
          <div className="font-bold text-xl mb-2">${price}</div>
          <p className="text-gray-700 text-base">Condition: {condition}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
