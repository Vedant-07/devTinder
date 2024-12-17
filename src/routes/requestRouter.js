const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { isStatusValidForSending } = require("../utils/validation");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const status = req.params.status;
      const toUserId = req.params.userId;
      console.log(
        req.user.firstName +
          " " +
          status +
          " from " +
          fromUserId +
          "  to  " +
          toUserId
      );
      //check that request.send has only interested/ignore

      if (!isStatusValidForSending(status))
        throw new Error("invalid status state entered ");

      //check whether the request is already sent from the other end

      //check whether toUser exists or not in the user database
      const isValidToUser = await User.findById(toUserId);
      if (!isValidToUser)
        throw new Error("this to user doesnt exist in the system");

      //check whether or not connection request is already sent/present
      const query = ConnectionRequest.find(); //find() returns the array when there was await

      const checkQueryField = await query.or([
        { fromUserId, toUserId },//corrected this mistake
        { fromUserId: toUserId, toUserId: fromUserId },
      ]);
      // this checkQueryField is an array !!!!
      console.log(checkQueryField.length); 
      //alternative method is this 
    //   const checkQueryField = await ConnectionRequest.findOne({
    //     $or: [
    //       { toUserId: toUserId, fromUserId: fromUserId },
    //       { toUserId: fromUserId, fromUserId: toUserId },
    //     ],
    //   });

      if (checkQueryField.length>0) throw new Error("connection already exists");

      //cant send request to oneself
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        status,
        toUserId,
      });

      await connectionRequest.save();
      res.send("connection request has been added");
    } catch (err) {
      res.status(404).send("error in request/send ==> " + err.message);
    }
  }
);

module.exports = requestRouter;
