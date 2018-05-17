'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Movie = require('../models/movie');
const Comment = require('../models/comment');

/* GET profile page. */
router.get('/:username', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'not-authorized' });
    return;
  }
  const username = req.params.username;

  User.findOne({'username': username})
    .populate('movies')
    .populate('shows')
    .populate('comments')
    .populate('comments.movie')
    .populate('comments.show')
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'not-authorized' });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(422).json({ code: 'unprocessable-entity' });
  }

  const userId = req.session.currentUser._id;
  const commentId = req.params.id;

  Comment.findById(commentId)
    .populate('movie', 'movie._id')
    .populate('show', 'show._id')
    .then((comment) => {
      if (!comment) {
        res.json({code: 'comment-not-found'});
        return;
      }
      User.findByIdAndUpdate(userId, { $pull: { comments: comment } })
        .then(() => {
          Movie.findByIdAndUpdate(comment.movie.id, { $pull: { comments: comment } })
            .then(() => {
              comment.remove()
                .then(() => {
                  res.json(comment);
                });
            });
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
