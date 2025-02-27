const express = require("express");
const User = require("../models/User");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { checkProfileEdit ,validateProfilePassword} = require("../utils/validation");
const bcrypt = require("bcryptjs");

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    //assuming the user exists here.....
    const user = req.user;
    console.log("user orginal ", user);
    const editValues = req.body;
    console.log("user from the prifile/edit ", editValues);

    if (!checkProfileEdit(editValues))
      throw new Error("valid fields arent passed in the profile/edit");

    const query = { _id: user.id };
    
    const userAfter = await User.findByIdAndUpdate(user.id, editValues, {
      returnDocument: "after",
      runValidators: true,
    });

    res
      .status(200)
      .send(
        userAfter
      );
  } catch (err) {
    res.status(404).send("user ain't updated ==> " + err.message);
  }
});

// get or post here???
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // //take out the cookies here
    // const { token } = req.cookies;
    // //assuming evertghing goes well
    // const deCrypt = jwt.verify(token, "7");
    // const user = await User.findById(deCrypt.data);
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("problem in token  ", err);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    //add the validation that only password and email is passed
    let editObj = req.body;
    if (!validateProfilePassword(editObj))
      throw new Error("only send password and email plzz ");

    editObj.password=await bcrypt.hash(editObj.password,7)
    //not adding the util validation fn here,so as to check the schema validations
    await User.findByIdAndUpdate(user.id, editObj);
    //await newPasswordUser.save();
    res.status(200).send("Your password has been updated " + user.firstName);
  } catch (err) {
    res.status(400).send("problem in profile/password .....  "+ err);
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

module.exports = profileRouter;
