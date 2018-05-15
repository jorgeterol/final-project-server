'use strict';

const MovieDb = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const findShows = function (parameters, userId, limit, shows, iteration = 0, secondIteration = 0) {
  if (iteration > limit || secondIteration > 10) {
    return shows;
    // throw new Error('Recursive is fun, but dangerous');
  }
  return moviedb.discoverTv(parameters)
    .then((result) => {
      let showInArray = false;
      if (result.total_results > 0 && result.total_results <= 3) {
        for (let ix = 0; ix <= result.total_results - 1; ix++) {
          shows.push(result.results[ix]);
        }
        return shows;
      }
      const randomshow = result.results[Math.floor(Math.random() * result.results.length)];
      if (randomshow === undefined) { // Preventing from pushing an empty show.
        return shows;
      } else if (shows.length >= 1) { // Checking if Randomshow is already in the array.
        shows.forEach((show) => {
          if (show.id === randomshow.id) {
            showInArray = true;
          }
        });
      }
      if (showInArray) {
        return findShows(parameters, userId, limit, shows, iteration, ++secondIteration); // This should restart the bucle
      }
      shows.push(randomshow);
      // @todo this might be a repeated show
      if (shows.length < limit) {
        const numberOfPages = result.total_pages;

        if (numberOfPages > 1) {
          parameters.page = Math.floor(Math.random() * numberOfPages) + 1;
        } else if (numberOfPages === 1) {
          parameters.page = 1;
        }
        return findShows(parameters, userId, limit, shows, ++iteration, secondIteration);
      }
      return shows;
    })
    .catch((err) => {
      console.log(err);
    });
};

const showRandomizer = (parameters, userId) => {
  return findShows(parameters, userId, 3, []);
};

module.exports = showRandomizer;
