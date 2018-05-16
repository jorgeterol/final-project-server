'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new Schema({
  username: {
    type: ObjectId,
    ref: 'User'
  },
  movie: {
    type: ObjectId,
    ref: 'Movie'
  },
  show: {
    type: ObjectId,
    ref: 'Show'
  },
  comment: {
    type: String
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
