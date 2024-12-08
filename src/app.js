const express = require("express");
const connectDb=require("./config/database");
const User=require("./models/User")
const app = express();

app.use("/",express.json())

app.post("/signup",async(req,res)=>{

  const user=new User(req.body)

  try{
    await user.save()
    res.status(200).send(`user signed up successfully`)  
  }
  catch(err)
  {
    console.log("error happened in db",err);
    res.status(400).send("user didnt signed up ")  
  }

  
})

connectDb().then(()=>{
  console.log("connection was succesfull")

  app.listen(7777, "localhost", () => {
    console.log("Hello from new world terminal");
  });
  
})
.catch((err)=>console.log("damm encountered the errir here",err))


