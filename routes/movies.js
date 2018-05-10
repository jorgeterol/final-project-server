'use strict';

const express = require('express');
const router = express.Router();

const MovieDb = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

/* GET home page. */
router.post('/', (req, res, next) => {
  const voteAverageGte = req.body.rating || undefined;
  const language = req.body.language;
  const genre = req.body.genre;
  const releaseDate = req.body.date || undefined;

  //   'release_date.gte': releaseDate,

  const parameters = {
    language: language,
    'release_date.gte': releaseDate,
    'vote_average.gte': voteAverageGte,
    with_genres: genre
  };

  moviedb.discoverMovie(parameters)
    .then((result) => {
      res.json(result);
    })
    .catch(console.error);
});

module.exports = router;
