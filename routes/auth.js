const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

//! Check for duplicate username
router.get("/check-username", async (req, res) => {
  const { username } = req.query;
  const exists = await User.findOne({ username });
  res.json({ exists: !!exists });
});

//! Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) return res.send("User not found");

  const isMatch = await bcrypt.compare(password, existingUser.password);
  if (!isMatch) return res.send("Invalid credentials");

  res.redirect('/home');
});

//! Register Route
router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword} = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.send("Please fill all required fields");
  }

  if (password !== confirmPassword) {
    return res.send("Passwords do not match");
  }

  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) return res.send("User already exists with this username or email");

  const hashedPass = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPass});
  await newUser.save();

  res.send("Registration successful");
});

module.exports = router;
