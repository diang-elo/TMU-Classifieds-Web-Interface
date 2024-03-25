import React from "react";
import axios from "axios";
import "../App.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import ItemCard from "../components/cards/ItemCard";

function ItemsList() {
  const [searchedItems, setSearchedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let params = useParams();
  let [key, value] = params.term.split("=");
  let endpoint = "";
  let request = "get";
  console.log(value);
  console.log(key);
  endpoint = `http://localhost:10000/search/${key}/${value}`;

  const getSearch = (e) => {
    if (request === "get") {
      axios
        .get(endpoint)
        .then(function (response) {
          console.log(response);
          setSearchedItems(response.data);
          setIsLoading(false);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    }
  };
  useEffect(() => {
    getSearch(params.term);
  }, [params.term]);

  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <ClipLoader color="#36d7b7" />
    </div>
  ) : searchedItems.length === 0 ? (
    <div className="flex items-center justify-center h-screen">
      <div className="text-4xl">Does not exist</div>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {searchedItems.map((item) => (
        <div key={item._id}>
          <ItemCard
            type={key}
            id={item._id}
            imageUrl={item.images[0]}
            title={item.title}
            description={item.description}
            price={item.price}
            condition={item.condition}
          />
        </div>
      ))}
    </div>
  );
}

export default ItemsList;
