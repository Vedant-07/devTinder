const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/User");
const app = express();
const { checkValidation } = require("./utils/validation");
const bcrypt = require("bcryptjs");
const cookie_parser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use("/", express.json());
//for cookies use a middlewre
app.use(cookie_parser());
const userAuth = require("./middlewares/auth");

app.get("/user", async (req, res) => {
  const findUser = req.body.firstName;
  try {
    const user = await User.find({ firstName: findUser });
    if (user.length == 0) return res.send("No such user found");
    console.log(user);
    res.send("Found the user");
  } catch (err) {
    console.log("prob in  finding the /user", err);
  }
});

//feeed the data
app.get("/feed", async (req, res) => {
  const findUser = req.body.firstName;
  try {
    const users = await User.find({});
    if (users.length == 0) return res.send("No such user found");

    res.send(users);
  } catch (err) {
    console.log("prob in  finding the /user", err);
  }
});

app.post("/signin", async (req, res) => {
  try {
    const checkUser = await User.findOne({ emailID: req.body.emailID });
    if (!checkUser) throw new Error(" email doesnt exists");
    // console.log(req.body.password);
    // console.log(checkUser);
    const check = await bcrypt.compare(req.body.password, checkUser.password);
    // console.log("check ==> ", check);
    if (!check) throw new Error("invalid password ");
    //create a JWT token
    //res.cookie("token",checkUser._id)
    const crypticMsg = jwt.sign({ _id: checkUser._id }, "7", { expiresIn: 10 });
    res.cookie("token", crypticMsg);
    res.send("user is verified");
  } catch (e) {
    res.status(404).send("error : " + e);
  }
});

// get or post here???
app.get("/profile", userAuth, async (req, res) => {
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

app.post("/signup", async (req, res) => {
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

//delete the user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const what_query = await User.findByIdAndDelete(userId);
    res.send("user is deleted");
  } catch (err) {
    console.log(`error in deleting`, err);
    res.send("problem in delete");
  }
});

app.patch("/user/:userID", async (req, res) => {
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

connectDb()
  .then(() => {
    console.log("connection was succesfull");

    app.listen(7777, "localhost", () => {
      console.log("Hello from new world terminal");
    });
  })
  .catch((err) => console.log("damm encountered the errir here", err));
