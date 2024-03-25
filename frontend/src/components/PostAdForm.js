import React, { useState } from "react";
import axios from "axios";

function PostAdForm() {
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
    const { name, value } = e.target;

    // If the input is for images, split the value by commas to create an array
    const newValue =
      name === "images" ? value.split(",").map((image) => image.trim()) : value;

    setAdData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(adData);

    try {
      await axios.post(
        `http://localhost:10000/postAd/${adData.adType}`,
        adData
      );
      console.log("Ad for sale added successfully");
    } catch (error) {
      console.error("Error adding ad for sale:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <form className="max-w-lg w-full" onSubmit={handleSubmit}>
        <label className="block">
          Title:
          <input
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
          Images (URLs separated by commas):
          <input
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            name="images"
            value={adData.images}
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
