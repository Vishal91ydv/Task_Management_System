const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
connectDB(process.env.MONGODB_URI)

app.get("/",()=>{
    console.log("Home Page")
})

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port",process.env.PORT)
})
