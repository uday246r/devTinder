const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

             const allowedStatus = ["ignored", "interested"];
             
             if(!allowedStatus.includes(status)){
                return res.status(400).json({message: "Invalid status type: " + status });
             }

             // Is user valid to which we make connection request
             const toUser = await User.findById(toUserId);
             if(!toUser){
                return res.status(404).json({ message: "User not found" });
             }

             // If there is an existing ConnectionRequest
             const existingConnectionRequest = await ConnectionRequest.findOne({
                $or : [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
             });
             if(existingConnectionRequest){
                return res
                .status(400)
                .send({message: "Connection Request Already Exist!"})
             }

             const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
             });

             const data = await connectionRequest.save();

             res.json({
                message: req.user.firstName + " is " + status + " in " + toUser.firstName,
                data,
            });

        } catch(err){
            res.status(400).send("ERROR: " + err.message);
        }        
    }
);
 

module.exports = requestRouter;

