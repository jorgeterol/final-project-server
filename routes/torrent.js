'use strict';

const express = require('express');
const router = express.Router();
const MovieDb = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);
const torrentFinder = require('../helpers/torrentfinder');

/* GET home page. */
router.post('/', (req, res, next) => {
  const movieId = req.body.id;
  let imdbId;
  moviedb.movieInfo(movieId)
    .then((result) => {
      imdbId = result.imdb_id;
      torrentFinder(imdbId)
        .then((torrents) => {
          res.json(torrents);
        });
    });
});

module.exports = router;
