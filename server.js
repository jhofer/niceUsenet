'use strict';

var express = require('express'),
path = require('path'),
fs = require('fs'),
mongoose = require('mongoose'),
 logger = require('./lib/util/logger.js').create('/project/logfile.log');




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
 require('./lib/config/passport');

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
      logger.log('finished created admin');
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
  logger.log('Express server listening on port '+config.port+' in '+app.get('env')+' mode');
});

// Expose app
var exports = module.exports = app;





