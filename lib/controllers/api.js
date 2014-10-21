'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    usenet = require('./../../usnetScrawler.js');

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
    usenet.requestForumThreads(39, function(threads){
     return res.json(threads);
	});
};
