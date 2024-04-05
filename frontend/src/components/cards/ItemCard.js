import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function ItemCard({
  id,
  imageUrl,
  title,
  description,
  price,
  condition,
  type,
  onDelete,
  collectionName,
  showDelete = false, // Assuming a prop function for handling the deletion
}) {
  const navigate = useNavigate();
  const [adType, setAdType] = useState(type);

  // Prevent the navigate function from triggering when clicking the delete mark
  const deleteDocument = async (e, collectionName, id) => {
    e.stopPropagation(); // Prevent event from bubbling up
    try {
      const response = await axios
        .delete(
          `https://tmu-classifieds-web-interface.onrender.com/remove/${collectionName}/${id}`
        )
        .then(
          Swal.fire({
            title: "Succesfully Deleted Ad",
            confirmButtonText: "Ok",
            icon: "success",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              window.location.reload();
            }
          })
        );
    } catch (error) {
      console.error(
        "Error deleting document",
        error.response?.data?.error || error.message
      );
    }
  };

  useEffect(() => {
    console.log(type);
    if (type === "Wanted") {
      setAdType("byWanted");
    }
    if (type === "Sale") {
      setAdType("bySale");
    }
    if (type === "Service") {
      setAdType("byService");
    }
  }, []);

  return (
    <div
      onClick={() => navigate(`/adsInfo/${id}/${adType}`)}
      className="cursor-pointer max-w-xl mx-auto bg-white rounded-xl overflow-hidden shadow-md flex transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg relative" // Added relative for positioning the delete mark
      style={{ height: "250px" }} // Fixed height
    >
      {showDelete && (
        <div className="absolute top-0 right-0 p-2">
          {" "}
          {/* Position the delete mark */}
          <button
            onClick={(e) => deleteDocument(e, collectionName, id)}
            className="text-3xl font-semibold text-red-500 hover:text-red-700"
            style={{ transform: "translate(50%, -50%)", cursor: "pointer" }} // Adjust positioning and make the cursor a pointer
          >
            × {/* This is the "x" mark */}
          </button>
        </div>
      )}
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
