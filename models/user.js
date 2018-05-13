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
    _id: {
      type: ObjectId,
      ref: 'Movie'
    },
    movieID: {
      type: Number
    },
    title: {
      type: String
    }
  }],
  comments: [{
    comment: {
      type: String,
      ref: 'Comment'
    },
    movie: {
      type: ObjectId,
      ref: 'Movie'
    }
  }]

});

const User = mongoose.model('User', userSchema);

module.exports = User;
