const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

const generateToken = require('../config/generateToken');
const { sendVerificationEmail, sendForgotPasswordEmail } = require('../config/sendEmail');

// register user
usersRouter.post('/', async (req, res) => {
  const { username, email, password, passwordConfirmation } = await req.body;
  
  if (!username || !email || !password || !passwordConfirmation) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
  }

  // validate email
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter valid email address." })
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password should be a minimum of 8 characters.' });
  }

  if (password !== passwordConfirmation) {
    return res.status(400).json({ success: false, message: 'Passwords must match.' })
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(403).json({ success: false, message: 'Username is already in use.' });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(403).json({ success: false, message: 'Email is already in use.' });
  }

  // create password hash to store user on server
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
    const port = req.hostname === 'localhost' ? ':5000' : ''
    const verifyLink = `http://${req.hostname}${port}/api/token/verify-token?token=${token}`;

    // send verification email
    const sendEmail = await sendVerificationEmail(newUser.email, verifyLink);

    if (sendEmail) {
      return res.status(201).json({success: true, message: "Registration successfull." });
    } else {
      return res.status(201).json({success: true, message: "Registration successfull. Error in sending verification email." });
    }
  });
});

usersRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Please enter valid email address." })
  }

  // validate email
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter valid email address." })
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(403).json({ success: false, message: 'User not found.' });
  }


  const token = generateToken({ email: existingUser.email }, '1d');

  // link to reset password
  const port = req.hostname === 'localhost' ? ':5000' : ''
  const verifyLink = `http://${req.hostname}${port}/api/token/verify-token?token=${token}`;

  // send password reset email
  const sendEmail = await sendForgotPasswordEmail(email, verifyLink);

  if (sendEmail) {
    return res.status(201).json({success: true, message: "Email Sent." });
  } else {
    return res.status(201).json({success: true, message: "Error in sending email." });
  }
});

usersRouter.post('/reset-password', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  
  if (!email || !password || !passwordConfirmation) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
  }

  // validate email
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter valid email address." })
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password should be a minimum of 8 characters.' });
  }

  if (password !== passwordConfirmation) {
    return res.status(400).json({ success: false, message: 'Passwords must match.' })
  }
  
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(404).json({ success: false, message: 'User email not found.' });
  }

  // create password hash to store on server
  bcrypt.hash(password, 12, async (err, hash) => {
    const passwordHash = hash;

    const updatedUser = await User.findOneAndUpdate({ email }, { passwordHash });

    if (updatedUser) {
      return res.status(200).json({ success: true, message: 'Password successfully updated.' });
    } else {
      return res.status(500).json({ success: true, message: 'Something went wrong.' })
    }
  });
});

module.exports = usersRouter;