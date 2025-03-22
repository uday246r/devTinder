const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
// Creating a new instance of the User model
    const user = new User({
        firstName: "Uday",
        lastName: "Chauhan",
        emailId: "udaychauhan246r@gmail.com",
        password: "RadheShyam",
        _id: '343',
    });
    await user.save();
    res.send("User added sucessfully");
});


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

