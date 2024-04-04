const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

//json web token information
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

// upload image stuff
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

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

const bcrypt = require("bcrypt");
const saltRounds = 8;

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

//Filipp:
//function to use json web token to authenticate a user when they login
function generateAccessToken(user) {
  const payload = {
    name: user.name,
    email: user.email,
    password: user.password,
    isAdmin: user.isAdmin,
  };

  const options = { expiresIn: "1h" };

  const tokenBack = {
    message: "success",
    token: jwt.sign(payload, secret, options),
  };

  return tokenBack;
}
//Filipp
//when we login, server hears this request and takes user data, returning a generated web token just for them
//we also check information against database to ensure the user exists and input the correct information
app.post("/auth/login", async (req, res) => {
  console.log("We made it to server");
  const database = client.db(process.env.MONGO_DB_NAME);
  const collection = database.collection("Users");
  const email = req.body.email;

  //const user = await collection.findOne({email: email}, {password:{$exists:true}});
  const user = await collection.findOne({ email: email });
  //console.log("user fetch is: " +user.userAds);

  if (!user) {
    console.log("no/wrong user");
    res.json({ message: "error, user doesn't exist" });
    return;
  }
  const userPassword = user.password;
  console.log("user return is: " + userPassword);

  const correctPassword = await bcrypt.compare(req.body.password, userPassword);
  if (!correctPassword) {
    console.log("wrong password");
    res.json({ message: "password is incorrect" });
    return;
  }

  const name = user.name;
  const admin = user.isAdmin;

  const response = generateAccessToken({
    name: name,
    email: email,
    password: userPassword,
    isAdmin: admin,
  });
  res.json(response);
});
//Filipp:
//this post read handles registration, ensuring the email is unique before accepting a new user data input
app.post("/auth/registration", async (req, res) => {
  console.log("the server heard our DB post request");
  const database = client.db(process.env.MONGO_DB_NAME);
  const collection = database.collection("Users");
  const email = req.body.email;
  const checkExists = await collection.findOne({ email: email });

  console.log("email= " + email);

  if (checkExists) {
    console.log("it already exists");
    res.json({ message: "exists" });
    return;
  }
  //password database storage protection
  const password = req.body.password;
  console.log("password=" + password);
  const hash_Password = await bcrypt.hash(password, saltRounds);
  console.log("we have hashed the password: " + hash_Password);
  const name = req.body.name;
  const admin = req.body.isAdmin;

  const data = {
    name: name,
    email: email,
    password: hash_Password,
    isAdmin: admin,
    userAds: [],
  };
  await collection.insertOne(data);
  console.log("we should have inserted a record now");
  res.json({ message: "success" });
});

//function to verify an access token
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
//a function that checks to see if user is sending us proper tokens
function authenticateToken(req, res) {
  //const authHeader = req.headers['jwttoken'];
  //const token = authHeader && authHeader.split('jwt-token')[-1];
  const token = req;
  console.log("we are authenticating");

  if (!token) {
    console.log("the first failed");
    return false;
  }

  const result = verifyAccessToken(token);
  console.log(result);

  if (!result.success) {
    console.log("the second failed");
    return false;
  }

  return result;
}

app.get("/auth/protected", async (req, res) => {
  const result = authenticateToken(req.headers.jwttoken);
  /* const response = {
    boolToken: authenticateToken(req.headers.jwttoken),
  }; */
  console.log("response payload = " + result);
  //checking to see if we can fetch data from tokens
  try {
    console.log("email fetch is: " + result.data.email);
  } catch (error) {
    console.log("an error occured:");
    console.log(error);
    console.log("SADSSDD");
  }
  res.json(result);
});

const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "tmu-images",
    acl: "public-read",
    key: function (request, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
}).single("image"); // Use .single for one file

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

app.post("/postAd/:adType", upload, async (req, res) => {
  const adType = req.params.adType; // Extract adType from URL params
  const database = client.db(process.env.MONGO_DB_NAME);
  let collection;
  console.log(req.file);

  // Determine the collection based on adType
  if (adType === "bySale") {
    collection = database.collection("Sale");
  }
  if (adType === "byWanted") {
    collection = database.collection("Wanted");
  }
  if (adType === "byService") {
    collection = database.collection("Service");
  }

  // Construct ad object
  const ad = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    location: req.body.location,
    category: req.body.category,
    condition: req.body.condition,
    images: req.file ? [req.file.location] : null, // Image URL from DigitalOcean Spaces
  };

  // Insert ad into the collection
  try {
    const result = await collection.insertOne(ad);
    res
      .status(201)
      .json({ message: "Ad added successfully", adId: result.insertedId });
  } catch (error) {
    console.error("Error adding ad:", error);
    res.status(500).json({ error: "Failed to add ad" });
  }
});

app.get("/getallads/", async (req, res) => {
  try {
    const database = client.db(process.env.MONGO_DB_NAME);
    const collectionNames = ["Sale", "Wanted", "Service"];
    let allItems = []; // This array will hold all documents from all collections

    for (let name of collectionNames) {
      try {
        const collection = database.collection(name);
        const data = await collection.find({}).toArray();
        // Concatenate the current collection's documents to the allItems array
        allItems = allItems.concat(
          data.map((item) => ({ ...item, collection: name }))
        ); // Optionally add collection name to each item
      } catch (collectionError) {
        console.error(`Error accessing collection ${name}:`, collectionError);
        // Decide how to handle individual collection errors, e.g., skip or send a partial error
      }
    }

    res.json(allItems); // Send all items as a single array
  } catch (err) {
    console.error("Error retrieving data from MongoDB", err);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

app.delete("/remove/:collectionName/:id", async (req, res) => {
  try {
    const database = client.db(process.env.MONGO_DB_NAME);
    const collection = database.collection(req.params.collectionName);
    // Correct usage of the new keyword with ObjectId
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Document successfully deleted." });
    } else {
      res.status(404).json({ message: "Document not found." });
    }
  } catch (error) {
    console.error("Error deleting document", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the document." });
  }
});

app.get("/items/:adType", async (req, res) => {
  const { min, max } = req.query;
  const adType = req.params.adType;
  let collectionName = "";

  try {
    const database = client.db(process.env.MONGO_DB_NAME);
    if (adType === "bySale") {
      collectionName = "Sale";
    } else if (adType === "byWanted") {
      collectionName = "Wanted";
    } else if (adType === "byService") {
      collectionName = "Service";
    } else {
      return res.status(400).json({ error: "Invalid ad type" });
    }

    const collection = database.collection(collectionName);

    let query = {};
    console.log(typeof min, max.length, "tteteet");

    // Only apply price filtering if both min and max values are provided
    if (min.length !== 0 && max.length !== 0) {
      const numMin = parseInt(min, 10);
      const numMax = parseInt(max, 10);

      query = {
        $expr: {
          $and: [
            { $gte: [{ $toInt: "$price" }, numMin] },
            { $lte: [{ $toInt: "$price" }, numMax] },
          ],
        },
      };
    }

    const items = await collection.aggregate([{ $match: query }]).toArray();

    res.json(items);
  } catch (error) {
    console.error("Failed to retrieve items:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving items." });
  }
});

// requests listen
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server is listening on port", port);
});
