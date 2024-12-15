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

module.exports=userRouter