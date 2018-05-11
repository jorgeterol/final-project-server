'use strict';

const express = require('express');
const movieRandomizer = require('../helpers/movierandomizer');

const router = express.Router();

router.post('/', (req, res, next) => {
  const voteAverageGte = req.body.rating || undefined;
  const language = req.body.language || undefined;
  const genre = req.body.genre || undefined;
  const releaseDate = req.body.date || undefined;
  const voteCounting = 100; // Minimum votes

  if (releaseDate > 2018 || voteAverageGte > 10 || voteAverageGte < 0) {
    res.status(400).json({code: 'invalid parameters for the search'});
    return;
  }

  const parameters = {
    'language': language,
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

module.exports = router;
