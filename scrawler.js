'use strict';

var
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  scrawler = require('./lib/services/usenetScrawler.js'),
  parser = require('./lib/services/forumParser.js'),
  _ = require('lodash'),

  async = require('async');


/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

var Movie = mongoose.model('Movie'),
  ms = require('./lib/services/movie.js');

//clean movies in development
if (process.env.NODE_ENV === 'development') {
  console.log('delete movies');
  Movie.find({}).remove().exec();
}


var createMovies = function (movie, callbackDone) {


  async.series([function (next) {
    scrawler.getHTML(movie.threadUrl, function (html) {
      movie =  _.merge(movie, parser.parseMovie(html));
      next();
    });
  }, function (next) {
    if (movie.imdbLink) {
      console.log('load imdb: '+movie.imdbLink);
      scrawler.getHTML(movie.imdbLink, function (html) {
        movie =  _.merge(movie, parser.parseImdb(html));
        next();

      });

    } else {
      next();
    }

  }, function (next) {

    ms.createOrUpdate(movie,next);

  }, function (next) {
    next();
    callbackDone();
  }]);
};


function loadThreads(movies, forumId) {

  console.log('scrawl eacg thread html');
  console.log(movies);
  async.eachSeries(movies, createMovies, function (err) {
    console.log('All done');
  });
}


var forums = [31];
function loadForums() {
  console.log('going to load movies');
  forums.forEach(function (forumId) {
    var movies;
    async.series([
      function (next) {
        console.log('scrawl forum');
        scrawler.getHTML('http://www.usenetrevolution.info/vb/forumdisplay.php?f=' + forumId, function (html) {
          console.log('got forum html');
           fs.writeFile('forumHtml.html', html);
          movies = parser.parseMovies(html, forumId);
          next();
        });
      }, function (callback) {
        console.log("now get all movie.js threads");
        loadThreads(movies, forumId);
        callback();
      }]);
  });
}


scrawler.init();
scrawler.on('ready', function () {
  loadForums();

  var minutes = 20, the_interval = minutes * 60 * 1000;
  setInterval(function () {
    loadForums();
  }, the_interval);

});








