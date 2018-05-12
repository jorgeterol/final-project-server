'use strict';

let existingMovie = false;

const checkArrayOfMovies = (user, movieID) => {
  user.movies.find((movie) => {
    if (movie.movieID === movieID) {
      existingMovie = true;
    }
  });

  return existingMovie;
};

module.exports = checkArrayOfMovies;
