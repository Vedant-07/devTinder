const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {checkValidation}=require('../utils/validation')
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    checkValidation(req.body);
    const saltRounds = 7;
    const newPwd = await bcrypt.hash(req.body.password, saltRounds);
    console.log(newPwd);
    req.body.password = newPwd;
    const user = new User(req.body);
    await user.save();
    res.status(200).send(`user signed up successfully`);
  } catch (err) {
    console.log("error happened in db", err);
    res.status(400).send("user didnt signed up " + err);
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ emailID: req.body.emailID });
    if (!user) throw new Error(" email doesnt exists");
    // console.log(req.body.password);
    // console.log(checkUser);
    const checkUser = await user.isPasswordValidated(req.body.password);
    // console.log("check ==> ", check);
    if (!checkUser) throw new Error("invalid password ");
    //create a JWT token
    //res.cookie("token",checkUser._id)

    //const crypticMsg = jwt.sign({ _id: checkUser._id }, "7", { expiresIn: 10 });
    res.cookie("token", user.getJWT());
    res.send("user is verified");
  } catch (e) {
    res.status(404).send("error : " + e);
  }
});


module.exports=authRouter