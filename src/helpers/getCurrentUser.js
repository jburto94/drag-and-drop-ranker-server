const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getCurrentUser = async token => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return false;
  }

  console.log(decodedToken);

  try {
    const currentUser = await User.findById(decodedToken._id);
    return currentUser;
  } catch (err) {
    return false;
  }
}

module.exports = getCurrentUser;