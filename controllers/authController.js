const { UsersModel } = require("../models/userModel.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const checkEmail = await UsersModel.find({ email: email });
  if (checkEmail.length > 0) {
    res.status(400).json({ message: "email already exist" });
  } else {
    const hashPassword = await bcryptjs.hash(password, 14);
    const adduser = await UsersModel.insertOne({
      name: name,
      email: email,
      password: hashPassword,
      role: req.body.role || "user"
    });
    adduser.save();

    const userData = await UsersModel.find(
      { email: email },
      { __v: false, password: false, createdAt: false, updatedAt: false }
    );

    res.status(200).json({
      message: "Registered successfully",
      data: userData,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await UsersModel.findOne({ email: email });

    if (checkUser) {
      console.log(checkUser);
      const checkPassword = await bcryptjs.compare(
        password,
        checkUser.password
      );
      if (checkPassword) {
        const { _id,name,email,role} = checkUser;
        const userInfo = { _id, name, email, role };
        const token = await jwt.sign(userInfo, process.env.jwt_secret_key, {
          expiresIn: "48h",
          algorithm: "HS384",
        });
        res.json({
          message: "Login successfully",
          userInfo: userInfo,
          token,
        });
      } else {
        res.status(429).json({ message: "Invalid email/password" });
      }
    } else {
      res.status(429).json({ message: "Invalid email/password" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "internal server error" });
  }
};

const getProfile = async(req, res) => {
  try {
      const user = await UsersModel.findOne({_id:req.user._id}, {password:false})
      res.json(user)
  } catch (error) {
    res.status(400).json({message:"Internal server error"})
  }
};

module.exports = { signup, login, getProfile };