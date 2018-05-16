'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET home page. */
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

module.exports = router;
