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


function loadThreads(movies) {

  console.log('scrawl each thread html');
  console.log(movies);
  async.eachSeries(movies, createMovies, function (err) {
    if(err)throw err;
    console.log('All done');
  });
}


function loadForum(forumUrl, callbackDone) {
  console.log('load forum: '+forumUrl);
  var movies;
  async.series([
    function (next) {
      console.log('scrawl forum');
      scrawler.getHTML(forumUrl, function (html) {
        console.log('got forum html');

        movies = parser.parseMovies(html, forumUrl);
        next();
      });
    }, function (next) {
      console.log("now get all movie threads");
      loadThreads(movies);
      next();
      callbackDone();
    }]);
}
var forums = ['http://www.usenetrevolution.info/vb/forumdisplay.php?f=31',
              'http://www.usenetrevolution.info/vb/forumdisplay.php?f=39'];
function loadForums() {
  console.log('going to load movies');
  async.eachSeries(forums, loadForum, function (err) {
    if(err)throw err;
    console.log('Forums Scrawled ');
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








