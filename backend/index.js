const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

// express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
const url = process.env.MONGO_CONNECTION; // MongoDB connection string
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}
connectToMongoDB();

// // routes
// app.get("/ads/:adType/all", async (req, res) => {
//   try {
//     const database = client.db(process.env.MONGO_DB_NAME); // Replace with your database name
//     const adType = req.params.adType;
//     let collection = "";
//     if (adType === "bySale") {
//       collection = database.collection("Sale");
//     }
//     if (adType === "byWanted") {
//       collection = database.collection("Wanted");
//     }
//     if (adType === "byService") {
//       collection = database.collection("Service");
//     }
//     const data = await collection.find({}).toArray();
//     res.json(data);
//   } catch (err) {
//     console.error("Error retrieving data from MongoDB", err);
//     res.status(500).json({ error: "Failed to retrieve data" });
//   }
// });

app.get("/search/:adType/", async (req, res) => {
  try {
    const database = client.db(process.env.MONGO_DB_NAME); // Replace with your database name
    const adType = req.params.adType;
    let collection = "";
    if (adType === "bySale") {
      collection = database.collection("Sale");
    }
    if (adType === "byWanted") {
      collection = database.collection("Wanted");
    }
    if (adType === "byService") {
      collection = database.collection("Service");
    }
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error retrieving data from MongoDB", err);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

app.get("/search/:adType/:item", async (req, res) => {
  try {
    const queryParam = req.params.item; // Get the query parameter from the request URL
    const database = client.db(process.env.MONGO_DB_NAME);
    console.log(queryParam);
    const adType = req.params.adType;
    let collection = "";
    if (adType === "bySale") {
      collection = database.collection("Sale");
    }
    if (adType === "byWanted") {
      collection = database.collection("Wanted");
    }
    if (adType === "byService") {
      collection = database.collection("Service");
    }
    let query = {}; // Initialize an empty query object

    // If a query parameter is provided, create a case-insensitive regex to match titles
    if (queryParam) {
      query = { title: { $regex: queryParam, $options: "i" } };
    }

    const data = await collection.find(query).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error retrieving data from MongoDB", err);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

app.get("/info/:adType/:id", async (req, res) => {
  try {
    const database = client.db(process.env.MONGO_DB_NAME);
    const adType = req.params.adType;
    let collection = "";
    if (adType === "bySale") {
      collection = database.collection("Sale");
    }
    if (adType === "byWanted") {
      collection = database.collection("Wanted");
    }
    if (adType === "byService") {
      collection = database.collection("Service");
    }

    const postId = req.params.id;
    const post = await collection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return res.status(404).json({ error: "Sale post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error("Error retrieving sale post:", err);
    res.status(500).json({ error: "Failed to retrieve sale post" });
  }
});

app.post("/postAd/:adType", async (req, res) => {
  try {
    const adData = req.body;
    const adType = req.params.adType;
    const database = client.db(process.env.MONGO_DB_NAME);
    let collection = "";
    console.log(adType);
    if (adType === "bySale") {
      collection = database.collection("Sale");
    }
    if (adType === "byWanted") {
      collection = database.collection("Wanted");
    }
    if (adType === "byService") {
      collection = database.collection("Service");
    }

    const result = await collection.insertOne(adData);

    res
      .status(201)
      .json({ message: "Ad  added successfully", adId: result.insertedId });
  } catch (err) {
    console.error("Error adding ad :", err);
    res.status(500).json({ error: "Failed to add ad " });
  }
});

app.get("/", (req, res) => {
  res.json({ mssg: "Hello World!" });
});

// requests listen
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server is listening on port", port);
});
