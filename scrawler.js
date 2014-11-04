'use strict';

var
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose');


 var scrawler = require('./lib/services/usenetScrawler.js');

 var parser = require('./lib/services/forumParser.js'),
  _ = require('lodash'),
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


Movie.find({}).remove();

var forums = [31];

function loadMovies (){
  console.log('going to load movies');
  _.each(forums, function(forumId){

    var sequence = Sequence.create();

    sequence.then(function (next) {
      console.log('scrawl forum');
      scrawler.getHTML('http://www.usenetrevolution.info/vb/forumdisplay.php?f=' + forumId, function (html) {
        console.log('got forum html');
        fs.writeFile('forumHtml.html', html);
        var movies = parser.parseMovies(html);
        console.log(movies);
        next(movies);
      });

    }).then(function (next, movies) {
      console.log('scrawl eacg thread html');
        _.each(movies, function (movie) {
          console.log('movie iteration');
          movie.forumId = forumId;

          var movieSequence = Sequence.create();
          movieSequence.then(function (next) {
            console.log('get thread html');
            scrawler.getHTML(movie.threadUrl, function (html) {
              console.log('get thread html done');
              movie = _.merge(movie, parser.parseMovie(html));
              next(movie);
            });
          }).then(function (next, movie) {
            if (movie.imdbLink) {
              console.log('go for the imdb');
                scrawler.getHTML(movie.imdbLink, function(html){
                  console.log(' imdb done');
                    movie = _.merge(movie, parser.parseImdb(html));
              next(movie);
            });

            }else{
              next(movie);
            }

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

scrawler.on('ready',function (){
  loadMovies();

  var minutes = 5, the_interval = minutes * 60 * 1000;
  setInterval(function() {
    loadMovies();
  }, the_interval);

});








