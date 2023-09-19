const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
    unique: true,
  },
  forename: {
    type: String,
    unique: false,
  },
  surname: {
    type: String,
    unique: false,
  },
  photo: {
    type: String,
    default: 'https://cdn.discordapp.com/attachments/1153420108652367975/1153420764951883786/profile.png'
  },
  inbox: {
    type: Array,
    default: []
  },
  outbox: {
    type: Array,
    default: []
  },
  archive: {
    type: Array,
    default: []
  },
  organisations: {
    type: Array,
    default: []
  }
},{
    collection: 'characters'
});

module.exports = mongoose.model('Character', characterSchema);
