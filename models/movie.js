'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const movieSchema = new Schema({
  movieID: {
    type: Number
  },
  title: {
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

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
