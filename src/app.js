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

// Get user by email
app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId;
    try{
    const users = await User.find({emailId: userEmail});
    if(users.length === 0){
        res.status(404).send("User not found");
    }
    else{
    res.send(users);
    }
} catch (err) {
    res.status(400).send("Something went wrong");
}
});

// Feed API - GET /feed - get all the users from the database  
app.get("/feed", async (req,res) => {

    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
});

//Delete API

app.delete("/delete", async(req,res) =>{
    const userId = req.body.userId;
    try{
        // const user = await User.findByIdAndDelete({_id: userId});
        const user = await User.findByIdAndDelete(userId);
        res.send("User Deleted Successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
});

// Update API
app.patch("/update", async (req, res) =>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        await User.findByIdAndUpdate({ _id: userId}, data);
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
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

// 1: 05