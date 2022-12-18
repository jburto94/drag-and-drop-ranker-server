require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const usersRouter = require('./src/controllers/users');
const loginRouter = require('./src/controllers/login');
const verifyTokenRouter = require('./src/controllers/verifyToken');
const listsRouter = require('./src/controllers/lists');
const verifyEmailRouter = require('./src/controllers/verifyEmail');

const app = express();

app.use(cors());
app.options('*', cors());

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