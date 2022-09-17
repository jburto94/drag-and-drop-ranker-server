require('dotenv').config();
const express = require('express');

const app = express();

const db = require('./src/db/db');
db();

app.get('/', (req, res) => {
  res.json('this is the root route')
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});