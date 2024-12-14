const express = require("express");
const User = require("../models/User");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");

profileRouter.patch("/user/:userID", async (req, res) => {
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

  
// get or post here???
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // //take out the cookies here
    // const { token } = req.cookies;
    // //assuming evertghing goes well
    // const deCrypt = jwt.verify(token, "7");
    // const user = await User.findById(deCrypt.data);
    const user = req.user;
    res.send("tis is user token " + user);
  } catch (err) {
    res.send("problem in token  ", err);
  }
});

//delete the user
profileRouter.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
      const what_query = await User.findByIdAndDelete(userId);
      res.send("user is deleted");
    } catch (err) {
      console.log(`error in deleting`, err);
      res.send("problem in delete");
    }
  });


module.exports=profileRouter