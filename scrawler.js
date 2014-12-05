'use strict';

var
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),

  scrawler = require('./lib/services/usenetScrawler.js'),
  parser = require('./lib/services/forumParser.js'),
  _ = require('lodash'),
  logger = require('./lib/util/logger.js').create('/project/logfile.log'),
  async = require('async');


/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

var Forum = mongoose.model('Forum'),
    ms = require('./lib/services/movie.js');


var createMovies = function (movie, callbackDone) {


  async.series([function (next) {
    scrawler.getHTML(movie.threadUrl, function (html) {
      movie =  _.merge(movie, parser.parseMovie(html));
      next();
    });
  }, function (next) {
    if (movie.imdbLink) {
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
  logger.info('scrawl each thread html');
  async.eachSeries(movies, createMovies, function (err) {
    if(err){
      throw err;
    }
    logger.success('All done');
  });
}


function loadForum(forum, callbackDone) {
  logger.info('load forum:  '+forum.title);
  var movies;
  async.series([
    function (next) {
      scrawler.getHTML(forum.forumUrl, function (html) {
        movies = parser.parseMovies(html, forum.forumUrl);
        next();
      });
    }, function (next) {
      loadThreads(movies);
      next();
      callbackDone();
    }]);
}

function loadForums() {
  Forum.find({}, function(err, forums){
    logger.info('going to load movies');
    async.eachSeries(forums, loadForum, function (err) {
      if(err){
        throw err;
      }
    });

  });


}





scrawler.init('crawler', function(){
  loadForums();

  var minutes = 20, theInterval = minutes * 60 * 1000;
  setInterval(function () {
    loadForums();
  }, theInterval);

});









