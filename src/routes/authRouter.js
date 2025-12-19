const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { checkValidation } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    checkValidation(req.body);
    const saltRounds = 7;
    const newPwd = await bcrypt.hash(req.body.password, saltRounds);
    console.log(newPwd);
    req.body.password = newPwd;
    const user = new User(req.body);
    const signedUpUser = await user.save();
    res.cookie("token", signedUpUser.getJWT(), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000
    });
    res.status(200).send(signedUpUser);
  } catch (err) {
    console.log("error happened in db", err);
    res.status(400).send("user didnt signed up " + err);
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ emailID: req.body.emailID });
    if (!user) throw new Error("email doesnt exists");
    const checkUser = await user.isPasswordValidated(req.body.password);
    if (!checkUser) throw new Error("invalid password");
    res.cookie("token", user.getJWT(), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000
    });
    res.send(user);
  } catch (e) {
    res.status(404).send("error : " + e);
  }
});

authRouter.post("/signout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0)
  });
  res.send("user is signed out.......");
});

module.exports = authRouter;