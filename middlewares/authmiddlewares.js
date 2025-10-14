const jwt = require("jsonwebtoken");
require("dotenv").config();
const {UsersModel} = require("../models/userModel.js")

const authentication = async (req, res, next) => {

  const { authorization } = req.headers;
  if(!authorization){
    return res.status(400).json({message:"Token not there"}) 
  }
  const token = authorization.split(" ")[1];
  try {
    const decodeToken = jwt.verify(token, process.env.jwt_secret_key);
    const checkuser = await UsersModel.findById(decodeToken.id, {_id:true, name:true, email:true})
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
  return async (req, res, next) => {
    try {
      const user = await UsersModel.findById(req.user._id, { role: true }); // <-- fix here
      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }
      const checkRole = roles.includes(user.role);
      if (checkRole) {
        next();
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
};



module.exports = { authentication,authorization };