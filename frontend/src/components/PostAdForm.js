import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function PostAdForm({ userData }) {
  const navigate = useNavigate();
  const [adData, setAdData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",

    condition: "New",
    adType: "bySale",
    organizer: {
      name: "",
      email: "",
      phone: "",
    },
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setAdData((prevData) => ({
        ...prevData,
        images: files[0], // Only taking the first file
      }));
    } else {
      setAdData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sellerData = JSON.stringify({
      Name: userData.name,
      Email: userData.email,
    });

    let contactType = "";
    if (adData.adType === "byWanted") {
      contactType = "buyer";
    } else {
      contactType = "seller";
    }

    const formData = new FormData();
    formData.append("title", adData.title);
    formData.append("description", adData.description);
    formData.append("price", adData.price);
    formData.append("location", adData.location);
    formData.append("category", adData.category);
    formData.append("condition", adData.condition);
    formData.append("adType", adData.adType);
    formData.append("image", adData.images);
    formData.append(contactType, sellerData);
    try {
      await axios
        .post(`http://localhost:10000/postAd/${adData.adType}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(
          Swal.fire({
            title: "Succesfully posted",
            confirmButtonText: "Ok",
            icon: "success",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              if (adData.adType === "byWanted") {
                navigate("/ads/" + "byWanted=");
              } else if (adData.adType === "bySale") {
                navigate("/ads/" + "bySale=");
              } else if (adData.adType === "byService") {
                navigate("/ads/" + "byService=");
              }
            }
          })
        );
      console.log("Ad for sale added successfully");
    } catch (error) {
      console.error("Error adding ad for sale:", error);
      Swal.fire({
        title: "Error: try again",
        confirmButtonText: "Ok",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex justify-center">
      <form className="max-w-lg w-full" onSubmit={handleSubmit}>
        <label className="block">
          Title:
          <input
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            name="title"
            value={adData.title}
            onChange={handleChange}
          />
        </label>
        <label className="block mt-4">
          Description:
          <textarea
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="description"
            value={adData.description}
            onChange={handleChange}
          />
        </label>
        <label className="block mt-4">
          Price:
          <input
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            name="price"
            value={adData.price}
            onChange={handleChange}
          />
        </label>
        <label className="block mt-4">
          Location:
          <input
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            name="location"
            value={adData.location}
            onChange={handleChange}
          />
        </label>
        <label className="block mt-4">
          Category:
          <input
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            name="category"
            value={adData.category}
            onChange={handleChange}
          />
        </label>
        <label className="block mt-4">
          Condition:
          <select
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="condition"
            value={adData.condition}
            onChange={handleChange}
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Refurbished">Refurbished</option>
          </select>
        </label>
        <label className="block mt-4">
          Ad Type:
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="adType"
            value={adData.adType}
            onChange={handleChange}
          >
            <option value="bySale">For Sale</option>
            <option value="byWanted">Wanted</option>
            <option value="byService">Service</option>
          </select>
        </label>
        <label className="block mt-4">
          Images:
          <input
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="file"
            name="image" // Change this to singular since it's one file at a time
            onChange={handleChange}
          />
        </label>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
        >
          Post Ad
        </button>
      </form>
    </div>
  );
}

export default PostAdForm;
