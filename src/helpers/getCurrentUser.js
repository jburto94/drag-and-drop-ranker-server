const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getCurrentUser = async token => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token.', error: err });
  }

  return await User.findOne({id: decodedToken.id});
}

module.exports = getCurrentUser;