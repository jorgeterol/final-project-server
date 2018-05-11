'use strict';

const MovieDb = require('moviedb-promise');

const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const findMovies = function (parameters, limit, movies, iteration = 0) {
  if (iteration > limit) {
    throw new Error('Recursive is fun, but dangerous');
  }
  return moviedb.discoverMovie(parameters)
    .then((result) => {
      const randomMovie = result.results[Math.floor(Math.random() * result.results.length)];
      // @todo this might be a repeated movie
      movies.push(randomMovie);
      if (movies.length < limit) {
        const numberOfPages = result.total_pages;
        parameters.page = Math.floor(Math.random() * numberOfPages);
        return findMovies(parameters, limit, movies, ++iteration);
      }
      return movies;
    });
};

const movieRandomizer = (parameters) => {
  return findMovies(parameters, 3, []);
};

module.exports = movieRandomizer;
