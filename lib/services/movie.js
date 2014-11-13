'use strict';
var mongoose = require('mongoose'),
   Movie = mongoose.model('Movie'),
  _ = require('lodash');



 var createOrUpdate = function(movie, callback){

   console.log('createOrUpdate');
   console.log(movie);

  var now = new Date();
  Movie.find({threadUrl: movie.threadUrl}, function (err, movies) {
    if (err) {
      console.log('failed to find movie');
      console.log(JSON.stringify(movie));
      console.log(err);
    }
    if (movies.length ===1) {
      var savedMovie = movies[0];
      savedMovie = _.assign(savedMovie, movie);
      savedMovie.save(function(err, updatedMovie){
        if (err) {
          console.log('failed to save movie');
          console.log(JSON.stringify(updatedMovie));
          console.log(err);
        }
        if(callback)callback();
      });

    } else {
      //save
      console.log('save movie');
      movie.updated_at = now;
      movie.created_at = now;

      var movieObject = new Movie(movie);
      movieObject.save(function (err) {
        if (err) {
          console.log('failed to save movie');
          console.log(JSON.stringify(movie));
          console.log(err);
        }
        if(callback)callback();
      });
    }

  });
};

module.exports.createOrUpdate = createOrUpdate;
