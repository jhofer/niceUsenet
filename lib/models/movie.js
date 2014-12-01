'use strict';

var mongoose = require('mongoose'),
  validators = require('mongoose-validators'),
  Schema = mongoose.Schema;

var patcher = require('./dbPatch.js');//load db patches model

var modelName = 'Movie';

/**
 * Movie Schema
 */
var movieSchemas = [

  new Schema({
    created_at: {type: Date},
    updated_at: {type: Date},
    title: {type: String, required: true},
    threadUrl: {type: String, required: true},
    forumUrl: {type: String, required: true},
    fileName: String,
    thxLink: String,
    image: String,
    imdbLink: String,
    password: String,
    status: {type: String, required: true, default: 'download'},
    rating: Number,
    genres: [String]
  })
  ,new Schema({
    createdAt: {type: Date},
    updatedAt: {type: Date},
    title: {type: String, required: true},
    threadUrl: {type: String, required: true},
    forumUrl: {type: String, required: true},
    fileName: String,
    thxLink: String,
    image: String,
    imdbLink: String,
    password: String,
    status: {type: String, required: true, default: 'download'},
    rating: Number,
    genres: [String]
  })
];


function getModel(schema){
  delete mongoose.connection.models[modelName];
  return mongoose.model(modelName,schema);
}

function setCurrentSchema(){
  delete mongoose.connection.models[modelName];
  mongoose.model(modelName, movieSchemas[movieSchemas.length - 1]);
}


patcher.addPatch(1, 'rename created_at to created', function () {
  console.log('patch execute');

  var OldSchema = getModel(movieSchemas[0]);
  OldSchema.find({},function (err, movies) {

    movies.forEach(function (movie) {
      var createdAt = movie.created_at;
      var updatedAt = movie.updated_at;
      movie.created_at = undefined;
      movie.updated_at = undefined;
      movie.save(function(err){
        if(err)throw err;

        var NewSchema =getModel(movieSchemas[1]);
        NewSchema.findById(movie._id, function (err, newMovie) {
          newMovie.updatedAt = updatedAt;
          newMovie.createdAt = createdAt;
          newMovie.save(function(err){
            if(err)throw err;
          });
        });

      });

    });
  });
  setCurrentSchema();
});


patcher.addPatch(2, 'rename created_at to created', function () {
  console.log('patch execute');

  var OldSchema = getModel(movieSchemas[0]);
  OldSchema.find({},function (err, movies) {

    movies.forEach(function (movie) {
      var createdAt = movie.created_at;
      var updatedAt = movie.updated_at;
      movie.created_at = undefined;
      movie.updated_at = undefined;
      movie.save(function(err){
        if(err)throw err;

        var NewSchema =getModel(movieSchemas[1]);
        NewSchema.findById(movie._id, function (err, newMovie) {
          newMovie.updatedAt = updatedAt;
          newMovie.createdAt = createdAt;
          newMovie.save(function(err){
            if(err)throw err;
          });
        });

      });

    });
  });
  setCurrentSchema();
});


setCurrentSchema();




