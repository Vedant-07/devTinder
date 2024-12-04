const express = require("express");

const app = express();

// app.use("/user", (req, res) => {
//   res.send("hi again");
// });

app.use("/", (err, req, res, next) => {
  if (err) {
    console.log("got and errror");
    res.status(404).send("&&&&&&&&&&&&&&&&&&&&&&");
  }
  console.log("hang ho gaya isnt ???");
  //next();
});

app.get("/user", (req, res) => {
  //res.send("user get");
  console.log("chalo bhai");
  res.send("done for now");
});

//for the dynamic parameter
app.post("/random/:usr", (req, res) => {
  console.log(req.params);
});

//for the parameter which has query fields ,that is the ?
app.post("/posting", (req, res) => {
  console.log(req.query);
  res.send("user info send here");
});

app.listen(7777, "localhost", () => {
  console.log("Hello from new world terminal");
});
