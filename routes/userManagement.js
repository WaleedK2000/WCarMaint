const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.get("/ping", async (req, res) => {
  res
    .status(200)
    .json({ message: "Connected to User Management API", req: req.body });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
      } else {
        const token = jwt.sign({ userId: user._id }, "secretKey", {
          expiresIn: "1h",
        });

        const refreshToken = jwt.sign(
          { userId: user._id },
          "refreshSecretKey",
          {
            expiresIn: "7d",
          }
        );

        res
          .status(200)
          .json({
            message: "User logged in successfully",
            user,
            token,
            refreshToken,
          });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to log in user" });
  }
});

router.get("/user/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User found", user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, email, password, userType } = req.body;

  res.status(401).json({ message: "Failed" });

  try {
    const user = await User.create({ username, email, password, userType });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

router.get("/getUsers", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

module.exports = router;
