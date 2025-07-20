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
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   const existingUser = await User.findOne({ email });
//   if (!existingUser) return res.send("User not found");

//   const isMatch = await bcrypt.compare(password, existingUser.password);
//   if (!isMatch) return res.send("Invalid credentials");

//   res.redirect('/home');
// });
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  console.log("Login input:", emailOrUsername, password);

  const existingUser = await User.findOne({
    $or: [
      { email: emailOrUsername },
      { username: emailOrUsername }
    ]
  });

  if (!existingUser) return res.send("User not found");

  const isMatch = await bcrypt.compare(password, existingUser.password);
  if (!isMatch) return res.send("Invalid credentials");

  req.session.username = existingUser.username;

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

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout error:", err);
      return res.send("Error logging out");
    }
    res.redirect('/login');
  });
});

router.get('/get-username', (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).json({ username: null });
  }
});




module.exports = router;
