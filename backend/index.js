const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

//json web token information
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

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
      email: user.email,
      password: user.password
    };
    
    const options = { expiresIn: '1h' };

    const tokenBack = {
        message: "success",
        token: jwt.sign(payload, secret, options)
    }
  
    return tokenBack;
}
//Filipp
//when we login, server hears this request and takes user data, returning a generated web token just for them
//we also check information against database to ensure the user exists and input the correct information
app.post('/auth/login', async (req,res) =>{
    console.log("We made it to server");
    const database = client.db(process.env.MONGO_DB_NAME);
    const collection = database.collection('Users');
    const email = req.body.email;
    const user = await collection.findOne({email}, {password:{$exists:true}});

    if (!user) {
        console.log("no/wrong user");
        res.json({message: "error, user doesn't exist"});
        return;
    }
    const userPassword = user.password;
    console.log("user return is: " +userPassword);

    const correctPassword = await bcrypt.compare(req.body.password, userPassword);
    if (!correctPassword) {
        console.log("wrong password");
        res.json({message: "password is incorrect"});
        return;
    }

    const response = generateAccessToken({email: email,password: userPassword});
    res.json(response);
})
//Filipp:
//this post read handles registration, ensuring the email is unique before accepting a new user data input
app.post('/auth/registration', async (req, res) => {
    console.log("the server heard our DB post request");
    const database = client.db(process.env.MONGO_DB_NAME);
    const collection = database.collection('Users');
    const email = req.body.email;
    const checkExists = await collection.findOne({email: email});

    console.log("email= " +email);

    if (checkExists) {
        console.log("it already exists");
        res.json({message: "exists"});
        return;
    }
    //password database storage protection
    const password = req.body.password;
    console.log("password=" +password);
    const hash_Password = await bcrypt.hash(password, saltRounds);
    console.log("we have hashed the password: " + hash_Password);

    const data = {email: email, password: hash_Password, userAds: []};
    await collection.insertOne(data);
    console.log("we should have inserted a record now");
    res.json({message: "success"});
})

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
  
    return true;
  }

  app.get('/auth/protected' , async (req, res) => {
    //result = authenticateToken(req.headers.jwttoken);
    const response = {
        boolToken: authenticateToken(req.headers.jwttoken)
    };
    console.log(response.boolToken);
    res.json(response);
  });
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
    console.log("searchbySaleAll");
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
