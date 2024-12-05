const express = require("express");
const connectDb=require("./config/database");
const app = express();

connectDb().then((result)=>{
  console.log("connection was succesfull",result)// TODO : check here sometimes they directly print the console.log ????

  app.listen(7777, "localhost", () => {
    console.log("Hello from new world terminal");
  });
  
})
.catch((err)=>console.log("damm encountered the errir here",err))


