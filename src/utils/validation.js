const validator = require("validator");

const checkValidation = (req) => {
  console.log(req);

  const {firstName, lastName, emailID, password} = req;
  if (!firstName.length > 0 || !lastName.length > 0) {
    throw new Error("enter proper firstName & lastName");
  }
  if (!validator.isEmail(emailID)) throw new Error("Not a valid email");
  if (!validator.isStrongPassword(password))
    throw new Error("enter a strong pwd plzzz");
};

module.exports = {
  checkValidation,
};
