const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel.js")

const authentication = async (req, res, next) => {

  const { authorization } = req.headers;
  if(!authorization|| !authorization.startsWith("Bearer ")){
    return res.status(400).json({message:"Token not there"}) 
  }
  const token = authorization.split(" ")[1];
  try {
    const decodeToken = jwt.verify(token, process.env.jwt_secret_key);
    const checkuser = await User.findById(decodeToken._id, {_id:true, name:true, email:true,role:true})
    if(checkuser){
      req.user = checkuser
      next();
    }else{
      res.status(403).json({message:"Invalid user"})
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

const authorization = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "User not found or role missing" });
    }

    const checkRole = roles.includes(req.user.role);
    if (checkRole) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};



module.exports = { authentication,authorization };