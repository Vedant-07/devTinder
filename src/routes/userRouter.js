const express = require("express");
const User = require("../models/User");
const userRouter = express.Router();

//feeed the data
userRouter.get("/feed", async (req, res) => {
    //  `const findUser = req.body.firstName;
    try {
      const users = await User.find({});
      if (users.length == 0) return res.send("No such user found");
  
      res.send(users);
    } catch (err) {
      console.log("prob in  finding the /user", err);
    }
  });


module.exports=userRouter