const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
    try{
       // validation of data
    validateSignUpData(req);
    //Encrypt the password

    const { firstName, lastName, emailId, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
// Creating a new instance of the User model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
    });

    await user.save();
    res.send("User added sucessfully");
    } catch(err) {
        res.status(400).send("ERROR :  " + err.message);
    }
});

app.post("/login", async(req,res) => {
    try{
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if(!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            res.send("Login Successfully!!");
        } else{
            throw new Error("Invalid credentials");
        }

    } catch (err){
        res.status(400).send("Error : " + err.message);
    }
})

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

        const ALLOWED_UPDATES = [
            "userId",
            "photoURL",
            "about",
            "gender",
            "age",
            "skills",
        ];

    const isUpdateAllowed = Object.keys(data).every((k) => 
        ALLOWED_UPDATES.includes(k)
);
if(!isUpdateAllowed){
    res.status(400).send("Update not allowed");
}
if(data?.skills.length > 10){
    throw new Eroor("Skills cannot be more than 10");
}

        await User.findByIdAndUpdate({ _id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Update Failed:" + err.message);
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