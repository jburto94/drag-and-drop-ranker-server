const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
const generateToken = require('../config/generateToken');

loginRouter.post('/', async (req, res) => {
  const { email, password, remember } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all form fields.' });
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ success: false, message: 'Invalid email and/or password.' });
  }

  const matchPassword = await bcrypt.compare(password, existingUser.passwordHash);

  if (!matchPassword) {
    return res.status(400).json({ success: false, message: 'Invalid email and/or password.' });
  }

  const tokenExpiration = remember ? '60d' : '7d';

  const token = await generateToken({ email: existingUser.email, _id: existingUser._id }, tokenExpiration);
  
  return res.status(200).json({ success: true, token, message: 'You have successfully logged in.' });
});

module.exports = loginRouter;