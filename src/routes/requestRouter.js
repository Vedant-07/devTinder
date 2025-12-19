const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const {
  isStatusValidForReviewing,
  isStatusValidForSending,
} = require("../utils/validation");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

requestRouter.post(
  "/send/:status/:userId",
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
        { fromUserId, toUserId }, //corrected this mistake
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

      if (checkQueryField.length > 0)
        throw new Error("connection already exists");

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

requestRouter.post(
  "/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      // requestConnectionId <==> requestID
      const requestId = req.params.requestId;

      //status should be interested
      if (!isStatusValidForReviewing(status))
        throw new Error("invalid status code in review process");
      //check whether this requestId exists in the collection
      const isValidRequestId = await ConnectionRequest.findOne({
        status: "interested",
        _id: requestId,
      }).exec();
      console.log("isValidRequest  ==> " + isValidRequestId);
      //another alternative for it can be to use findOne
      // findOne({_id:requestId, status:"interested"})
      //check that only those whose connection is interested is allowed to change status to accepted/rejected
      if (!isValidRequestId)
        throw new Error(
          "request id doesn't exist in the system or the status isn't interested"
        );

      //check that the loggedIn user is the toUserId
      if (loggedInUser._id.equals(isValidRequestId.toUserId)) {
        await ConnectionRequest.findByIdAndUpdate(requestId, { status });
        res.send(
          loggedInUser.firstName + "  has been accpted the request from ... "
        );
      } else throw new Error("you cant update the connection status ");
    } catch (err) {
      res.status(404).send("problem in review/status " + err.message);
    }
  }
);

module.exports = requestRouter;
