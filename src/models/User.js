const mongoose = require("mongoose");

const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  emailID: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value))
        throw new error("invalid email found plz enter valid email id");
    },
  },
  password: {
    type: String,
    required: true,
    //TODO: whats the difference in the style of validators here
    validate: {
      //what if i change the name of the function || fast fwrd , this worked to be fine
      validator(password) {
        // also changing the name of the parameter here | check the docs duhhhhh.....
        return validator.isStrongPassword(password);
      },
      message: (msgVal) => {
        //what if i tried to write the message here using throw
        throw new Error("password isnt strong enough " + msgVal.message);
      },
    },
  },
  age: {
    type: Number,
    min: [18, "Must be atleast 18 ,got {VALUE}"],
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "others"],
      message: "{VALUE} , Please select the others category",
    },
  },
  bio: {
    type: String,
    default: "some text for the bio by default, edit later",
  },
  skills: {
    type: [String],
    validate: {
      validator(skills) {
        return skills.length > 0;
      },
      message: (props) => `${props.value} PLeasr addd atleast 1 skill`,
    },
    //this was the cosing style ,and its not mentioned in the docs???
    required: true,
  },
});

//creating the userSchema methods
userSchema.methods.getJWT = function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, "7", { expiresIn: 10 * 10 });
  return token;
};

userSchema.methods.isPasswordValidated = async function (userPassword) {
  const user = this;

  const isValid = await bcrypt.compare(userPassword, user.password);
  console.log("isValid : " + isValid);
  return isValid;
};

module.exports = mongoose.model("User", userSchema);
