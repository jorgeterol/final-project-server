'use strict';
const axios = require('axios');

const torrentFinder = function (imbdId) {
  const url = `https://yts.am/api/v2/list_movies.json?&query_term=${imbdId}`;
  return axios({
    method: 'get',
    url: url
  })
    .then((response) => {
      if (response.data.data.movie_count === 0) {
        return;
      };
      return response.data.data.movies;
    });
};

module.exports = torrentFinder;
