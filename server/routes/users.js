const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_TOKEN } = require("../config/config");

const verifyToken = require("../middleware/auth");
router.get("/auth", verifyToken, (req, res) => {
  res.json({
    error: null,
    data: {
      user: req.user, // token payload information
    },
  });
});

router.post("/register", async (req, res) => {
  // validate the user
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ error: error });
  }

  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const user = new User({
    name: req.body.role,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const savedUser = await user.save();
    res.json({ error: null, data: { userId: savedUser._id } });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({
      loginSuccess: false,
      message: "Auth failed, email not found",
    });
  }

  // check for password correctness
  const validPassword = req.body.password === user.password ? true : false;

  if (!validPassword) {
    return res.status(400).json({ error: "Password is wrong" });
  }

  const token = jwt.sign(
    // payload data
    { id: user._id, email: user.email, password: user.password },
    SECRET_TOKEN
  );

  res.header("auth-token", token).json({
    error: null,
    data: {
      token,
    },
  });
});

module.exports = router;
