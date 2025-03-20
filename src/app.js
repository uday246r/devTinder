const express = require('express');

const app = express();

app.use("/user",(req,res)=>{
    res.send("Hello from server !");
});

// Define middleware functions
// const rH = (req, res, next) => { console.log("rH middleware"); next(); };
// const rH2 = (req, res, next) => { console.log("rH2 middleware"); next(); };
// const rh3 = (req, res, next) => { console.log("rh3 middleware"); next(); };
// const rh4 = (req, res, next) => { console.log("rh4 middleware"); next(); };
// const rh5 = (req, res, next) => { console.log("rh5 middleware"); next(); };

// app.use("/route",rH,[rH2,rh3],rh4,rh5);  // we can put in array it will behave the same

app.get(
    "/users",
    (req,res,next)=>{
        console.log("Handling the riute user1");
        next();
    },
    (req,res,next)=>{
        console.log("Handling the riute user2");
        next();
    }, (req,res)=>{
        console.log("Handling the riute user3");
        res.send("3rd response");
    },
)

app.listen(3000,()=>{
    console.log("Successfull");
}); 