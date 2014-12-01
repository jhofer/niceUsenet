'use strict';

var express = require('express'),
path = require('path'),
fs = require('fs'),
//scrawler = require('./lib/services/usenetScrawler'),
 // downloader = require('./downloader.js'),
mongoose = require('mongoose');
//scrawler.init('server');

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


// Passport Configuration
var passport = require('./lib/config/passport');

var Movie = mongoose.model('Movie');
var User = mongoose.model('User');


// Clear old users, then add a default user
User.find({}).remove(function() {
  User.create({
      provider: 'local',
      name: 'serverlat',
      email: 'serverlat.server@gmail.com',
      password: 'Over9000',
      admin: true
    }, function() {
      console.log('finished created admin');
    }
  );
});


var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server

app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
var exports = module.exports = app;

//
//scrawler.on('ready',function(){
//  downloader.download();
//});



