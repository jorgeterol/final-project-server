'use strict';

let existingMovie = false;

const checkArrayOfMovies = function (user, newMovie) {
  user.movies.find((movie) => {
    if (movie.movieID === newMovie.movieID) {
      existingMovie = true;
    }
  });

  return existingMovie;
};

module.exports = checkArrayOfMovies;
