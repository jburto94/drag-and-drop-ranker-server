require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRouter = require('./src/controllers/users');
const loginRouter = require('./src/controllers/login');

const db = require('./src/db/db');
db();

app.use(cors());
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});