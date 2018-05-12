'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new Schema({
  movieID: {
    type: ObjectId,
    ref: 'Movie'
  },
  username: {
    type: String,
    ref: 'User'
  },
  comment: {
    type: String
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
