const mongoose = require("mongoose");

const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
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
        //what if i change the name of the function || fast forward , this worked to be fine
        validator(password) {
          return validator.isStrongPassword(password);
        },
        message: (msgVal) => {
          throw new Error("password isn't strong enough " + msgVal.message);
        },
      },
    },
    age: {
      type: Number,
      min: [10, "Must be at least 10 ,got {VALUE}"],
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
        message: (props) => `${props.value} PLease add at least 1 skill`,
      },
      required: true,
    },
    profile_pic: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//creating the userSchema methods
userSchema.methods.getJWT = function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

//creating the indexes on the user password & email password
userSchema.index({
  emailID: 1,
  password: 1,
});

userSchema.methods.isPasswordValidated = async function (userPassword) {
  const user = this;

  const isValid = await bcrypt.compare(userPassword, user.password);
  console.log("isValid : " + isValid);
  return isValid;
};

module.exports = mongoose.model("User", userSchema);
