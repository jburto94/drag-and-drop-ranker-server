require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRouter = require('./src/controllers/users');
const loginRouter = require('./src/controllers/login');
const verifyTokenRouter = require('./src/controllers/verifyToken');
const verifyEmailRouter = require('./src/controllers/verifyEmail');
const listsRouter = require('./src/controllers/lists');
const app = express();

app.use(cors());

app.options("/tube/latestted", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');        
  res.sendStatus(200);
});

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./src/db/db');
db();

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/token', verifyTokenRouter);
app.use('/api/email', verifyEmailRouter);
app.use('/api/lists', listsRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});