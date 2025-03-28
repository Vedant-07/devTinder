const express = require("express");
const connectDb = require("./config/database");
const cors = require("cors");
const app = express();
const cookie_parser = require("cookie-parser");

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const userRouter = require("./routes/userRouter");
const requestRouter = require("./routes/requestRouter");

const allowedOrigins = ['http://localhost:5173', 'http://3.109.212.47'];

const corsOptions = {
  origin: function(origin,callback){
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
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

    app.listen(7777, () => {
      console.log("Server listening on port 7777");
    });
  })
  .catch((err) => console.log("damm encountered the errir here", err));
