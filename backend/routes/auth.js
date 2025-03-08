const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // Import mongoose for ObjectId validation
const verifyToken = require("../middleware/authMiddleware"); 
const Transaction = require("../models/Transaction");

const router = express.Router();

//TEST ROUTE to verify if `auth.js` is working
router.get("/test", (req, res) => {
  res.json({ message: "Auth route is working!" });
});

//GET USER DATA (Authenticated)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//SIGNUP Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, contact, password } = req.body;

    // Check if the user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      contact,
      password: hashedPassword
    });

    // Save user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ 
      message: "User registered successfully",
      token,
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, avatar: newUser.avatar }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ 
      message: "Login successful", 
      token, 
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET USER DATA (Fixed)
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate if it's a proper MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    console.log("Fetching user with ID:", userId); // Debugging log

    // Select necessary fields including the avatar
    const user = await User.findById(userId).select("name avatar email");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user); // Debugging log
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update avatar endpoint
router.put("/update-avatar", verifyToken, async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user.userId;

    if (!avatar) {
      return res.status(400).json({ message: "Avatar URL is required" });
    }

    const user = await User.findByIdAndUpdate(userId, { avatar }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Avatar updated successfully", 
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar } 
    });
    
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user account and all associated data
router.delete("/delete-account", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete all transactions associated with the user
    await Transaction.deleteMany({ userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
