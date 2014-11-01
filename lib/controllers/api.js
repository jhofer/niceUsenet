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



exports.hdmovies = function(req, res) {

  return Movie.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};
