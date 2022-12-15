const mongoose = require('mongoose');

const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
  } catch (err) {
    console.log('not connecting to db', err);
    process.exit(1);
  }
}

module.exports = connect;