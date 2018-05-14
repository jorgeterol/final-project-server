'use strict';

const MovieDb = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const findMovies = function (parameters, userId, limit, movies, iteration = 0, secondIteration = 0) {
  if (iteration > limit || secondIteration > 10) {
    return movies;
    // throw new Error('Recursive is fun, but dangerous');
  }
  return moviedb.discoverMovie(parameters)
    .then((result) => {
      let movieInArray = false;
      if (result.total_results > 0 && result.total_results <= 3) {
        for (let ix = 0; ix <= result.total_results; ix++) {
          movies.push(result.results[ix]);
        }
        return movies;
      }
      const randomMovie = result.results[Math.floor(Math.random() * result.results.length)];
      if (randomMovie === undefined) { // Preventing from pushing an empty movie.
        return movies;
      } else if (movies.length >= 1) { // Checking if RandomMovie is already in the array.
        movies.forEach((movie) => {
          if (movie.id === randomMovie.id) {
            movieInArray = true;
          }
        });
      }
      if (movieInArray) {
        return findMovies(parameters, userId, limit, movies, iteration, ++secondIteration); // This should restart the bucle
      }
      movies.push(randomMovie);
      // @todo this might be a repeated movie
      if (movies.length < limit) {
        const numberOfPages = result.total_pages;

        if (numberOfPages > 1) {
          parameters.page = Math.floor(Math.random() * numberOfPages) + 1;
        } else if (numberOfPages === 1) {
          parameters.page = 1;
        }
        return findMovies(parameters, userId, limit, movies, ++iteration, secondIteration);
      }
      return movies;
    })
    .catch((err) => {
      console.log(err);
    });
};

const movieRandomizer = (parameters, userId) => {
  return findMovies(parameters, userId, 3, []);
};

module.exports = movieRandomizer;
