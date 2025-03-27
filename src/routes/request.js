const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/sendConnectionRequest",userAuth,  async(req,res) => {
    const user = req.user;
    console.log("Sending connection request");
    res.send(user.firstName + "sent the connect request!");
});

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,  
    async(req,res) => {
        try{
             const fromUserId = req.user._id;
             const toUserId = req.params.toUserId;
             const status = req.params.status;

             const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
             });

             const data = await connectionRequest.save();

             res.json({
                message: " Connection Request Send Successfully",
                data,
            });

        } catch(err){
            res.status(400).send("ERROR: " + err.message);
        }        
    }
);
 

module.exports = requestRouter;

//37.58