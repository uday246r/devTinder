const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
// Creating a new instance of the User model
    const user = new User(req.body);

    try{
    await user.save();
    res.send("User added sucessfully");
    } catch(err) {
        res.status(400).send("Eroor saving the user:" + err.message);
    }
});

// Feed API - GET /feed - get all the users from the database  


connectDB()
 .then(()=>{
    console.log("Database connection established....");
    app.listen(3000,()=>{
        console.log("Server successfully run on port no. 3000....");
    }); 
 })
 .catch((err)=>{
    console.log("Database cannot be established");
 });

