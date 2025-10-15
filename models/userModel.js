const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "host"], default: "user" },
  },
  { timestamps: true }
);

// ✅ Register model as "User" (uppercase to match references)
const User = mongoose.model("User", userSchema);

// ✅ Export the model directly
module.exports = User;
