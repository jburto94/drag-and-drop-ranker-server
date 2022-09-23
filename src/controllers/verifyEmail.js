const verifyEmailRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

verifyEmailRouter.get('/verify', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(404).json({ success: false, message: 'Invalid token.' });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token.', error: err });
  }

  const existingUser = await User.findOne({ email: decodedToken.email });

  if (!existingUser) {
    res.status(404).json({ success: false, message: 'User not found.' });
  }

  existingUser.verified = true;
  await existingUser.save();

  return res.status(200).json({ success: true, message: 'User has now been verified.' });
});

module.exports = verifyEmailRouter;