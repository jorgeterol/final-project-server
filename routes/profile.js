'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/:username', (req, res, next) => {
  const username = req.params.username;

  User.findOne({'username': username})
    .populate('movies')
    .populate('shows')
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

module.exports = router;
