'use strict';

const express = require('express');
const movieRandomizer = require('../helpers/movierandomizer');
const Movie = require('../models/movie');
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
    res.status(400).json({code: 'invalid-parameters'});
    return;
  }

  const parameters = {
    'language': language,
    'with_original_language': originalLanguage,
    'primary_release_date.gte': releaseDate,
    'vote_average.gte': voteAverageGte,
    'with_genres': genre,
    'vote_count.gte': voteCounting
  };

  movieRandomizer(parameters, userId)
    .then((movies) => {
      res.json(movies);
    })
    .catch(console.error);
});

router.post('/save', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'not-authorized' });
    return;
  }
  const userId = req.session.currentUser._id;
  const movieID = req.body.id;
  const title = req.body.title;
  const poster = req.body.poster_path;
  let exists = false;

  Movie.findOne({ 'movieID': movieID })
    .then((movie) => {
      if (!movie) {
        movie = new Movie({
          movieID: movieID,
          title: title,
          poster: poster
        });
      }
      return movie.save();
    })
    .then((movie) => {
      return User.findById(userId)
        .populate('movies')
        .then((user) => {
          user.movies.find((movieInUser) => {
            if (movieInUser.movieID === movie.movieID) {
              exists = true;
            }
          });
          if (exists) {
            return;
          }
          user.movies.push(movie);
          return user.save();
        });
    })
    .then(() => {
      if (!exists) {
        res.json({code: 'movie-saved'});
      } else {
        res.json({code: 'movie exists'});
      }
    })
    .catch(next);
});

router.post('/comment', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'not-authorized' });
    return;
  }
  const userId = req.session.currentUser._id;
  const movieID = req.body.movie.id;
  const title = req.body.movie.title;
  const poster = req.body.movie.poster_path;

  const comment = new Comment({
    username: userId,
    comment: req.body.comment
  });

  Movie.findOne({ 'movieID': movieID })
    .then((movie) => {
      if (!movie) {
        movie = new Movie({
          movieID: movieID,
          title: title,
          poster: poster
        });
      }

      comment.movie = movie.id;

      movie.comments.push(comment);

      return movie.save();
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
  const movieID = req.body.id;

  Movie.findOne({ 'movieID': movieID })
    .populate('comments.username')
    .then((movie) => {
      if (!movie) {
        res.json([]);
        return;
      }
      res.json(movie.comments);
    })
    .catch(next);
});

module.exports = router;
