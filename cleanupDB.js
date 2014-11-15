'use strict';

var mongoose = require('mongoose'),
path = require('path'),
  fs = require('fs');
// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});


return Movie.find(function (err, movies) {
  movies.forEach(function(movie){
      movie.status = 'download';
      movie.save();
    });
});
