const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // Check Authorization header first (for localStorage-based auth)
    const authHeader = req.headers.authorization;
    let token;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      // Fallback to cookie (for local development)
      token = req.cookies.token;
    }
    
    if (!token) {
      throw new Error("No token provided");
    }
    
    // Verify token
    const DecryptMsg = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = DecryptMsg;
    
    // Find user
    const user = await User.findById(_id);
    if (!user) throw new Error("No such user found");
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
  }
};

module.exports = userAuth;
