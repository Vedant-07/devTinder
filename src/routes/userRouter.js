const express = require("express");
const User = require("../models/User");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");

const validUserData = "firstName lastName age bio skills gender profile_pic";

//edit this later to some sensible info...
userRouter.patch("/user/:userID", async (req, res) => {
  const id = req.params.userID;
  console.log(id);
  const user = req.body;
  console.log(user);

  //this are the values which are allowed to change
  const ALLOWED_VALUES = ["password", "gender", "skills", "bio"];

  try {
    //assuming the user exists here.....
    const result = Object.keys(user).every((val) => {
      return ALLOWED_VALUES.includes(val);
    });
    console.log(
      "result of allowed valuessssssssssssssssssssssssssssssss ",
      result
    );
    if (!result) throw new Error("some listed values cant be updated");

    const query = { _id: id };
    const userBefore = await User.findOneAndUpdate(query, user, {
      returnDocument: "before",
      runValidators: true,
    });

    res.status(200).send(`user is updated ${JSON.stringify(userBefore)}`);
  } catch (err) {
    res.status(404).send("user ain't updated " + err);
  }
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    //user getting connections of status-- interested
    //get all the requestConnections where status--interested | loggedInUser is the toUserId

    const loggedInUser = req.user;
    //here im getting an array of docs
    const receivedUsers = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate({
      path: "fromUserId",
      select: "firstName lastName age gender skills bio profile_pic",
    });
    //use map to extract the fromUser
    const users = receivedUsers.map((val) => {
      return {
        ...val.fromUserId._doc,
        requestId:val._id
        //got the idea of spread operator
        // fromUser:val.fromUserId,
        // requestId:val._id
      };
    });

    res.json({
      message: "Here are the requests for " + loggedInUser.firstName,
      data: users,
    });
  } catch (err) {
    res.send("problem here in " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const users = await ConnectionRequest.find({
    status: "accepted",
    $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
  }).populate({
    path: "fromUserId toUserId",
    select: validUserData,
  });

  const connectedUsers = new Set();

  users.map((val) => {
    //check this one .....
    connectedUsers.add(val.fromUserId);
    connectedUsers.add(val.toUserId);
  });

  //remove loggedInUser from here
  const validUsers = Array.from(connectedUsers).filter((val) => {
    return !val._id.equals(loggedInUser._id);
  });

  res.json({
    message: "users connected to " + loggedInUser.firstName,
    data: validUsers,
  });
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page=+req.query.page || 0
    let limit=+req.query.limit || 3
    let skipPage=(page-1)*limit
    skipPage=skipPage<0?0:skipPage
    limit=limit>20?20:limit
    const connectedUsers = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).populate({
      path:"fromUserId toUserId",
      select:validUserData
    });

    const hideUsers = new Set();

    connectedUsers.map((val) => {
      hideUsers.add(val.fromUserId);
      hideUsers.add(val.toUserId);
    });

    //find the valid users

    
    const validUser = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).skip(skipPage).limit(limit);



    res.json({
      message: "connectedUsers are",
      data: validUser,
    });
  } catch (err) {
    res.status(404).send("problem in /user/feed " + err.message);
  }
});

module.exports = userRouter;
