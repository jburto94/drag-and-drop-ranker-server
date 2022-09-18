const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = data => (
  jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '7d' })
);