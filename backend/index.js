

const express = require("express")
const { MongoClient } = require('mongodb');
const cors = require("cors");

require('dotenv').config();


// Connection URL --> once mongo db is setup.
// const url = process.env.MONGO_CONNECTION;
// const client = new MongoClient(url);

// express app
const app = express();
app.use(cors());
app.use(express.json())

// routes 

app.get('/', (req, res)=> {
    res.json({mssg: 'Hello World!'})
})

// requests listen
app.listen(process.env.PORT, () => {
    console.log("listening on port",process.env.PORT )
})