'use strict';

var mongoose = require('mongoose'),
path = require('path'),
  fs = require('fs');



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

var DbPatch = mongoose.model('DbPatch');

var Movie = mongoose.model('Movie');

Movie.find(function (err, movies) {

  movies.forEach(function(movie){
      if(movie.status !== 'done'){
      movie.status = 'download';
      movie.save();
      }

    });
  console.log('clean done');
});




