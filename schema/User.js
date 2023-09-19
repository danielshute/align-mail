const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  discordId: {
    type: String,
    default: null
  },
  characters: {
    type: Array,
    default: []
  }
},{
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);
