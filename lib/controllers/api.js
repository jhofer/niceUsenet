'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    scrawler = require('../services/usenetScrawler.js'),
    parser = require('../services/forumParser.js'),
    Thing = mongoose.model('Thing'),
    request = require('request'),
    fs = require('fs'),
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
      request('http://serverlat:8085/api?mode=qstatus&output=json&apikey=4875bc17dfcc321f7c4f7361138dbce7', function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var info = JSON.parse(body);
          _.each(info.jobs, function(job){

          });

        }
      });
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
  Movie.findById(movieId, function (err, movie) {
    if (err) return next(err);
    if (!movie) return res.send(404);
    console.log('download movie'+JSON.stringify(movie))
    scrawler.getHTML(movie.threadUrl, function(html){
      var thxLink = parser.parseMovie(html).thxLink;
      if(thxLink) {
        console.log('push thanks'+ thxLink);
        scrawler.getHTML(thxLink, function (html) {
          loadMovie(html, movie, res);
        });
      }else{
        loadMovie(html, movie, res);
      }

    });

function loadMovie(html, movie, res){
  console.log('try download ');

  movie.password = parser.parsePassword(html);




  scrawler.download(movie.threadUrl, movie.password);

  res.send(movie );
}










  });
};
