

const express = require("express")
const { MongoClient } = require('mongodb');
const cors = require("cors");
require('dotenv').config();

//json web token information
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

// express app
const app = express();
app.use(cors());
app.use(express.json())

// MongoDB
const url = process.env.MONGO_CONNECTION; // MongoDB connection string
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

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
//when we login, server hears this request and takes user data, returning a generated web token just for them
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
    console.log("user return is: " +user.password);

    correctPassword = await bcrypt.compare(req.body.password, user.password);
    if (!correctPassword) {
        console.log("wrong password");
        res.json({message: "password is incorrect"});
        return;
    }

    const response = generateAccessToken(user);
    res.json(response);
})

//this post read handles registration
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
//middleware to check if a token is there.
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

// routes 
app.get('/ads/bysale/all', async (req, res) => {
    console.log("searchbySaleAll");
    try {
        const database = client.db(process.env.MONGO_DB_NAME); // Replace with your database name
  
        const collection = database.collection('Sale'); // Collection name
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (err) {
        console.error("Error retrieving data from MongoDB", err);
        res.status(500).json({ error: "Failed to retrieve data" });
    }
});

app.get('/search/bySale', async (req, res) => {
    console.log("searchbySale");
    try {
        const queryParam = req.query.item; // Get the query parameter from the request URL
        const database = client.db(process.env.MONGO_DB_NAME);
        const collection = database.collection('Sale'); // Collection name
        let query = {}; // Initialize an empty query object

        // If a query parameter is provided, create a case-insensitive regex to match titles
        if (queryParam) {
            query = { title: { $regex: queryParam, $options: 'i' } };
        }

        const data = await collection.find(query).toArray();
        res.json(data);
    } catch (err) {
        console.error("Error retrieving data from MongoDB", err);
        res.status(500).json({ error: "Failed to retrieve data" });
    }
});

app.get('/', (req, res) => {
    res.json({ mssg: 'Hello World!' });
});

// requests listen
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("Server is listening on port", port);
});