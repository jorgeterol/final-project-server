'use strict';

const express = require('express');
const showRandomizer = require('../helpers/showrandomizer');
const Show = require('../models/show');
const User = require('../models/user');
const Comment = require('../models/comment');

const router = express.Router();

router.post('/', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'not-authorized' });
    return;
  }

  const userId = req.session.currentUser._id;
  const voteAverageGte = req.body.rating || undefined;
  const language = req.body.language || undefined;
  let originalLanguage;
  if (language) {
    originalLanguage = language.slice(0, 2);
  }
  const genre = req.body.genre || undefined;
  const releaseDate = req.body.date || undefined;
  const voteCounting = 100; // Minimum votes

  if (releaseDate > 2018 || voteAverageGte > 10 || voteAverageGte < 0) {
    res.status(400).json({ code: 'invalid-parameters' });
    return;
  }

  const parameters = {
    'language': language,
    'with_original_language': originalLanguage,
    'first_air_date.gte': releaseDate,
    'vote_average.gte': voteAverageGte,
    'with_genres': genre,
    'vote_count.gte': voteCounting
  };

  showRandomizer(parameters, userId)
    .then((shows) => {
      res.json(shows);
    })
    .catch(console.error);
});

router.post('/save', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'not-authorized' });
    return;
  }
  const userId = req.session.currentUser._id;
  const showID = req.body.id;
  const name = req.body.name;

  Show.findOne({ 'showID': showID })
    .then((show) => {
      if (!show) {
        show = new Show({
          showID: showID,
          name: name
        });
      }
      return show.save();
    })
    .then((show) => {
      return User.findByIdAndUpdate(userId, { $push: { shows: show._id } });
    })
    .then(() => {
      res.json({ code: 'show-saved' });
    })
    .catch(next);
});

router.post('/comment', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'not-authorized' });
    return;
  }
  const userId = req.session.currentUser._id;
  const showID = req.body.show.id;
  const name = req.body.show.name;

  const comment = new Comment({
    username: userId,
    comment: req.body.comment
  });

  Show.findOne({ 'showID': showID })
    .then((show) => {
      if (!show) {
        show = new Show({
          showID: showID,
          name: name,
          comments: []
        });
      }

      comment.show = show.id;

      show.comments.push(comment);

      return show.save();
    })
    .then(() => {
      return comment.save();
    })
    .then(() => {
      return User.findByIdAndUpdate(userId, { $push: { comments: comment } });
    })
    .then(() => {
      return Comment.findById(comment._id).populate('username');
    })
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.post('/show', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'not-authorized' });
    return;
  }
  const showID = req.body.id;

  Show.findOne({ 'showID': showID })
    .populate('comments.username')
    .then((show) => {
      if (!show) {
        res.json([]);
        return;
      }
      res.json(show.comments);
    })
    .catch(next);
});

module.exports = router;
