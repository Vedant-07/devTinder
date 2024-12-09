const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/User");
const app = express();

app.use("/", express.json());

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

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(200).send(`user signed up successfully`);
  } catch (err) {
    console.log("error happened in db", err);
    res.status(400).send("user didnt signed up ");
  }
});


//delete the user
app.delete("/user",async(req,res)=>{

  const userId=req.body.userId
  try{
    const what_query=await User.findByIdAndDelete(userId)

    console.log(what_query);
    // what query retuens the document which was deleted
    // {
    //   _id: new ObjectId('67556f6e42d1b3bc54b6e6b4'),
    //   firstName: 'Vedant',
    //   lastName: 'Patel',
    //   emailID: 'vpatel@email.com',
    //   password: '12347',
    //   age: 23,
    //   gender: 'M',
    //   __v: 0
    // }
    res.send("user is deleted")
  }
  catch(err){
    console.log(`error in deleting`,err)
    res.send("problem in delete")
  }

})

connectDb()
  .then(() => {
    console.log("connection was succesfull");

    app.listen(7777, "localhost", () => {
      console.log("Hello from new world terminal");
    });
  })
  .catch((err) => console.log("damm encountered the errir here", err));
