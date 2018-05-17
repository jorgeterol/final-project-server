'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
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

  Comment.findByIdAndRemove(req.params.id)
    .then((comment) => {
      if (!comment) {
        res.json({code: 'comment-not-found'});
        return;
      }
      comment.remove()
        .then((comment) => {
          res.json(comment);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
