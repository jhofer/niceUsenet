'use strict'

var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  usenet = require('./lib/services/usnetScrawler.js'),
  forumParser = require('./lib/services/forumParser.js'),
  _ = require('lodash');




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


usenet.on('ready', function() {
  usenet.requestForumHtml(39, function(html) {
    console.log('parse hd forum');

    var threads = forumParser.parseMovies(html);

    _.each(threads, function (thread) {

      usenet.requestThreadHtml(thread.threadUrl, function (html) {

        var threadO = forumParser.parseMovie(html);

        var imdb = forumParser.parseImdb(threadO.imdbLink);
        var movieInfos =   _.merge(threadO, imdb, thread);

     //   console.log(movieInfos);
      });
    });



  });


});






