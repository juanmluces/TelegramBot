const mongoose = require('mongoose');

const mongoUrl = 'mongodb://127.0.0.1/NeoBootRoBot';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});