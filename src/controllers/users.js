const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

const generateToken = require('../config/generateToken');
const emailSender = require('../config/sendEmail');

// register user
usersRouter.post('/register', async (req, res) => {
  const { username, email, password } = await req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
  }

  // validate email
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter valid email address." })
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password should be a minimum of 8 characters.' });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(403).json({ success: false, message: 'Username is already in use.' });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(403).json({ success: false, message: 'Email is already in use.' });
  }

  // create password hash to store on server
  bcrypt.hash(password, 12, async (err, hash) => {
    const passwordHash = hash;

    const newUser = new User({
      username,
      email,
      passwordHash
    });
  
    await newUser.save();

    const token = generateToken({ email: newUser.email });

    // link to verify new account
    const verifyLink = `http://${req.hostname}:5000/api/email/verify?token=${token}`;

    // send verification email
    const sendEmail = await emailSender(newUser.email, verifyLink);

    if (sendEmail) {
      return res.status(201).json({success: true, message: "Registration successfull." });
    } else {
      return res.status(201).json({success: true, message: "Registration successfull. Error in sending verification email." });
    }
  });
});

module.exports = usersRouter;