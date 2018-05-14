'use strict';
const axios = require('axios');

const torrentFinder = function (imbdId) {
  const url = `https://yts.am/api/v2/list_movies.json?quality=720&query_term=${imbdId}`;
  return axios({
    method: 'get',
    url: url
  })
    .then((response) => {
      console.log(response);
      return response.data.data.movies[0].torrents;
    });
};

module.exports = torrentFinder;
