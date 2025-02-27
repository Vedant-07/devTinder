const express = require("express");
const connectDb = require("./config/database");
const cors = require("cors");
const app = express();
const cookie_parser = require("cookie-parser");

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const userRouter = require("./routes/userRouter");
const requestRouter = require("./routes/requestRouter");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use("/", cors(corsOptions));
app.use("/", express.json());
//for cookies use a middlewre
app.use(cookie_parser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);

connectDb()
  .then(() => {
    console.log("db connection was succesfull");

    app.listen(7777, "localhost", () => {
      console.log("Server listening on port 7777");
    });
  })
  .catch((err) => console.log("damm encountered the errir here", err));

// app.get("/user", async (req, res) => {
//   const findUser = req.body.firstName;
//   try {
//     const user = await User.find({ firstName: findUser });
//     if (user.length == 0) return res.send("No such user found");
//     console.log(user);
//     res.send("Found the user");
//   } catch (err) {
//     console.log("prob in  finding the /user", err);
//   }
// });