

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
      id: user.id,
      email: user.email,
      password: user.password
    };
    
    const options = { expiresIn: '1h' };
  
    return jwt.sign(payload, secret, options);
}

//function to verify an access token
function verifyAccessToken(token) {  
    try {
      const decoded = jwt.verify(token, secret);
      return { success: true, data: decoded };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

// routes 
app.get('/ads/bysale/all', async (req, res) => {
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