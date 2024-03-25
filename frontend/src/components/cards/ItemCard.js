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
      onClick={() => {
        navigate("/adsInfo/" + id + "/" + type);
      }}
      className="max-w-xl mx-auto bg-white rounded-xl overflow-hidden shadow-md flex"
    >
      <img className="w-1/3" src={imageUrl} alt={title} />
      <div className="w-2/3 px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
        <div className="font-bold text-xl mb-2">${price}</div>
        <p className="text-gray-700 text-base">Condition: {condition}</p>
      </div>
    </div>
  );
}

export default ItemCard;
