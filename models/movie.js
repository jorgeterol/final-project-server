'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  movieID: Number,
  title: String
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
