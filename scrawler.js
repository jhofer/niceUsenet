'use strict';

var
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  scrawler = require('./lib/services/usenetScrawler.js'),
  parser = require('./lib/services/forumParser.js'),
  _ = require('lodash'),
 request = require('sync-request'),
 Sequence =  require('sequence').Sequence;




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

var Movie = mongoose.model('Movie');

var forums = [31];

function loadMovies (){
  _.each(forums, function(forumId){

    var sequence = Sequence.create();

    sequence.then(function (next) {
      scrawler.getHTML('http://www.usenetrevolution.info/vb/forumdisplay.php?f=' + forumId, function (html) {
        var movies = parser.parseMovies(html);
        next(movies);
      });

    }).then(function (next, movies) {
        _.each(movies, function (movie) {
          movie.forumId = forumId;

          var movieSequence = Sequence.create();
          movieSequence.then(function (next) {
            scrawler.getHTML(movie.threadUrl, function (html) {
              movie = _.merge(movie, parser.parseMovie(html));
              next(movie);
            });
          }).then(function (next, movie) {
            if (movie.imdbLink) {
              var res = request('GET', movie.imdbLink);
              movie = _.merge(movie, parser.parseImdb(res.getBody()));
            }
            next(movie);
          }).then(function (next, movie) {
            console.log(movie);
            Movie.update({threadUrl: movie.threadUrl}, movie, {upsert: true}, function (err) {
              if (err) {
                console.log('failed to save movie');
                console.log(err);
              }
              next();

            });
          });



        });

        next();

    });


  });

}




loadMovies();

var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
  loadMovies();
}, the_interval);





