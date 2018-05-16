'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const showSchema = new Schema({
  showID: {
    type: Number
  },
  name: {
    type: String
  },
  poster: {
    type: String
  },
  comments: [{
    username: {
      type: ObjectId,
      ref: 'User'
    },
    comment: {
      type: String,
      ref: 'Comment'
    }
  }]
});

const Show = mongoose.model('Show', showSchema);

module.exports = Show;
