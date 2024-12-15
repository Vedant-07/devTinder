const User = require("../models/User");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  try {
    //read the token
    const { token } = req.cookies;
    if (!token)
      throw new Error("No token at the moment  from the UserAuth ...");
    //validator token
    const DecryptMsg = await jwt.verify(token, "7");
    const { _id } = DecryptMsg;
    //Identify the user
    const user = await User.findById(_id);
    console.log("user is ", user);
    if (!user) throw new Error("No such user is found from the UserAuth ... ");
    req.user = user;
    next();
  } catch (err) {
    res.status(404).send("Error Here exclusively from UserAuth  : " + err.message);
  }
};

module.exports = userAuth;
