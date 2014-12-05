'use strict';
var mongoose = require('mongoose'),
   Movie = mongoose.model('Movie'),
  logger = require('../util/logger.js').create('/project/logfile.log'),
  _ = require('lodash');



 var createOrUpdate = function(movie, callback){
  var now = new Date();
  Movie.find({threadUrl: movie.threadUrl}, function (err, movies) {
    if (err) {
      console.log('failed to find movie');
      console.log(JSON.stringify(movie));
      throw err;
    }
    if (movies.length ===1) {
      var savedMovie = movies[0];
      savedMovie = _.assign(savedMovie, movie);
      savedMovie.updatedAt = now;
      savedMovie.save(function(err, updatedMovie){
        if (err) {
          console.log('failed to save movie');
          console.log(JSON.stringify(updatedMovie));
          throw err;
        }
        if(callback)callback();
      });

    } else {
      //save

      movie.updatedAt = now;
      movie.createdAt = now;

      var movieObject = new Movie(movie);
      movieObject.save(function (err) {
        if (err) {
          console.log('failed to save movie');
          console.log(JSON.stringify(movie));
          throw err;
        }
        if(callback)callback();
      });
    }

  });
};

module.exports.createOrUpdate = createOrUpdate;
