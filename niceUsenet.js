var forever = require('forever-monitor'),
  logger = require('./lib/util/logger.js').create('/project/logfile.log'),
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose');
  patcher = require('./lib/models/dbPatch.js');

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


patcher.applyDelta();
logger.log('start server scrwaler and downloader');
var server = new (forever.Monitor)('server.js', {
  'silent': false
});
server.start();

var scrawler = new (forever.Monitor)('scrawler.js', {
  'silent': false
});
scrawler.start();


var downloader = new (forever.Monitor)('downloader.js', {
  'silent': false
});
downloader.start();
