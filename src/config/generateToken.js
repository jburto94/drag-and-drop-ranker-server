const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (data, tokenExpiration = '7d') => (
  jwt.sign(data, process.env.JWT_SECRET, { expiresIn: tokenExpiration })
);