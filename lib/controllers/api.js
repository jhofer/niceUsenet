'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Thing = mongoose.model('Thing'),
    Movie = mongoose.model('Movie');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};



exports.movies = function(req, res) {

  return Movie.find(function (err, movies) {
    if (!err) {
      return res.json(movies);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Change download movie
 */
exports.download = function(req, res, next) {
  var movieId = req.params.id;
  console.log("going to download movie"+movieId);
  Movie.findById(movieId, function (err, movie) {
    if (err) return next(err);
    if (!movie) return res.send(404);

    res.send(movie );

  });
};
