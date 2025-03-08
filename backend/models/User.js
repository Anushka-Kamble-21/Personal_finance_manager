const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "/avatars/default.png" }, // <-- Add avatar field
  },
  { timestamps: true } //adds `createdAt` and `updatedAt` fields automatically
);

const User = mongoose.model("User", userSchema);
module.exports = User;
