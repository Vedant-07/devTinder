const validator = require("validator");

const checkValidation = (req) => {
  console.log(req);

  const { firstName, lastName, emailID, password } = req;
  if (!firstName.length > 0 || !lastName.length > 0) {
    throw new Error("enter proper firstName & lastName");
  }
  if (!validator.isEmail(emailID)) throw new Error("Not a valid email");
  if (!validator.isStrongPassword(password))
    throw new Error("enter a strong pwd plzzz");
};

const checkProfileEdit = (data) => {
  const ALLOWED_VALUES = ["gender", "skills", "bio", "age","firstName","lastName","profile_pic"];
  const isValid = Object.keys(data).every((k) => {
    return ALLOWED_VALUES.includes(k);
  });

  console.log("check profile edit validation is ", isValid);
  return isValid;
};

const validateProfilePassword = (user) => {
  const ALLOWED_VALUES = ["password", "emailID"];
  const isValidFields = Object.keys(user).every((k) => {
    return ALLOWED_VALUES.includes(k);
  });
  console.log(
    "values are ok for the validateProfilePassword ===> ",
    isValidFields
  );
  return isValidFields;
};

const isStatusValidForSending=(status)=>{
  const ALLOWED_VALUES=["interested","ignore"]
  //trying the valid here,would it work?
  return  ALLOWED_VALUES.includes(status)
}

const isStatusValidForReviewing=(status)=>{
  const ALLOWED_VALUES=["accepted","rejected"]
  return ALLOWED_VALUES.includes(status)
}

module.exports = {
  checkValidation,
  validateProfilePassword,
  checkProfileEdit,
  isStatusValidForSending,
  isStatusValidForReviewing
};
