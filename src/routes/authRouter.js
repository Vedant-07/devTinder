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
    req.body.password = newPwd;
    const user = new User(req.body);
    const signedUpUser = await user.save();
    const token = signedUpUser.getJWT();
    
    res.status(200).json({
      user: signedUpUser,
      token: token
    });
  } catch (err) {
    res.status(400).send("Signup failed: " + err.message);
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ emailID: req.body.emailID });
    if (!user) throw new Error("Email doesn't exist");
    const checkUser = await user.isPasswordValidated(req.body.password);
    if (!checkUser) throw new Error("Invalid password");
    
    const token = user.getJWT();
    
    res.json({
      user: user,
      token: token
    });
  } catch (e) {
    res.status(404).send("Error: " + e.message);
  }
});

authRouter.post("/signout", (req, res) => {
  res.send("User signed out");
});

module.exports = authRouter;