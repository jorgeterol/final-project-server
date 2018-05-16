'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }],
  shows: [{
    type: ObjectId,
    ref: 'Show'
  }],
  comments: [{
    comment: {
      type: String,
      ref: 'Comment'
    },
    movie: {
      type: ObjectId,
      ref: 'Movie'
    },
    show: {
      type: ObjectId,
      ref: 'Show'
    }
  }]

});

const User = mongoose.model('User', userSchema);

module.exports = User;
