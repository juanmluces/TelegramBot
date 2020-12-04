const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  first_name: String,
  last_name: String,
  id: Number
});

module.exports = mongoose.model('user', userSchema);