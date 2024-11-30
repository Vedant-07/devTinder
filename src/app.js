const expresso = require("express");

const app = expresso();

app.use("/check", (req, res) => {
  res.send("hi again");
});

app.listen(7777,"localhost", () => {
  console.log("Hello from new world terminal");
});
