import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/cards/ItemCard";
import ClipLoader from "react-spinners/ClipLoader";

function AdminPage() {
  const [tokenData, setTokenData] = useState("");
  const [allAds, setAllAds] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwttoken");
    console.log(token);
    fetch("http://localhost:10000/auth/protected", {
      method: "GET",
      headers: {
        jwttoken: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTokenData(data.data);
        console.log(data);
      });
  }, []);

  useEffect(() => {
    if (tokenData && tokenData.isAdmin) {
      axios
        .get("http://localhost:10000/getallads/")
        .then(function (response) {
          console.log(response);
          setAllAds(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    }
  }, [tokenData]);

  return !tokenData || !tokenData.isAdmin ? (
    <div>Not an Admin user</div>
  ) : allAds ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {allAds.map((item) => (
        <div key={item._id}>
          <ItemCard
            id={item._id}
            imageUrl={item.images[0]}
            title={item.title}
            description={item.description}
            price={item.price}
            condition={item.condition}
            showDelete={true}
            collectionName={item.collection}
            type={item.collection}
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <ClipLoader color="#36d7b7" />
    </div>
  );
}

export default AdminPage;
