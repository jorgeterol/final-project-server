'use strict';

const express = require('express');
const movieRandomizer = require('../helpers/movierandomizer');

const router = express.Router();

router.post('/', (req, res, next) => {
  const voteAverageGte = req.body.rating || undefined;
  const language = req.body.language || undefined;
  const genre = req.body.genre || undefined;
  const releaseDate = req.body.date || undefined;
  const voteCounting = 100; // Mínimum votes

  const parameters = {
    'language': language,
    'release_date.gte': releaseDate,
    'vote_average.gte': voteAverageGte,
    'with_genres': genre,
    'vote_count.gte': voteCounting
  };

  movieRandomizer(parameters)
    .then(movies => {
      res.json(movies);
    })
    .catch(console.error);
});

module.exports = router;
