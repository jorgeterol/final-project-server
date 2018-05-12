'use strict';

const express = require('express');
const movieRandomizer = require('../helpers/movierandomizer');
const checkArrayOfMovies = require('../helpers/checkarrayofmovies');
const Movie = require('../models/movie');
const User = require('../models/user');
const Comment = require('../models/comment');

const router = express.Router();

router.post('/', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'not-authorized' });
    return;
  }

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

  movieRandomizer(parameters)
    .then(movies => {
      res.status(200).json(movies);
    })
    .catch(console.error);
});

router.post('/save', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const movieID = req.body.id;
  const title = req.body.title;

  Movie.findOne({ 'movieID': movieID })
    .then((movie) => {
      if (!movie) {
        const newMovie = new Movie({
          movieID: movieID,
          title: title,
          comments: []
        });

        newMovie.save()
          .then((movie) => {
            User.findById(userId)
              .then((user) => {
                User.findByIdAndUpdate(userId, { $push: { movies: movie } })
                  .then((user) => {
                    res.status(200).json({ code: 'movie-added' });
                  })
                  .catch(next);
              })
              .catch(next);
          })
          .catch(next);
      }

      User.findById(userId)
        .then((user) => {
          const existingMovie = checkArrayOfMovies(user, movieID);

          if (existingMovie) {
            res.json({ code: 'movie-exists' });
          }

          if (!existingMovie) {
            User.findByIdAndUpdate(userId, { $push: { movies: movie } })
              .then((user) => {
                res.status(200).json({ code: 'movie-added' });
              })
              .catch(next);
          }
        })
        .catch(next);
    })
    .catch(next);
});

router.post('/comment', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const movieID = req.body.movie.id;

  const comment = new Comment({
    movieID: movieID,
    username: userId,
    comment: req.body.comment
  });

  comment.save()
    .then((comment) => {

    })
    .catch(next);

  Movie.findOne({'movieID': movieID})
    .then((movie) => {
      if (!movie) {
        const newMovie = new Movie({
          movieID: req.body.movie.id,
          title: req.body.movie.title,
          comments: [comment]
        });

        newMovie.save()
          .then(() => {
            res.json({ code: 'movie-and-comment-created' });
          })
          .catch(next);
        return;
      }
      movie.comments.push(comment);
      movie.save()
        .then(() => {
          res.json({ code: 'comment-added' });
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
