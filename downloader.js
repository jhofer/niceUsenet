'use strict';

var
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  scrawler = require('./lib/services/usenetScrawler.js'),
  parser = require('./lib/services/forumParser.js'),
  _ = require('lodash'),


  async = require('async');


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

var Movie = mongoose.model('Movie'),
  ms = require('./lib/services/movie.js');



Movie.find(function (err, movies) {

  movies.forEach(function(movie){
    if(movie.status !== 'done'){
      movie.status = 'download';
      movie.save();
    }

  });
  console.log('clean done');
});



var passwordPath = '/nzb/Passwords.txt';

function storePw(threadHtml) {

  var pw = parser.parsePassword(threadHtml);

  if (pw) {
    if (!fs.existsSync(passwordPath)) {
      fs.writeFile(passwordPath, '', function (err) {
        if (err) {
          console.log('failed to create file' + passwordPath);
          throw err;
        }
      });
    }
    var currentPws = fs.readFileSync(passwordPath, 'utf8');

    if (currentPws.indexOf(pw) === -1) {
      fs.appendFile('/nzb/Passwords.txt', pw + '\r\n', function (err) {
        if (err) {

          console.log('failed to store downloadpw' + pw);
          console.log(err);
        }
      });
    } else {
      console.log('Password ' + pw + ' already exists');
    }
  }
}



function getFile(meta, callback) {

  console.log('download with casper');
  console.log(meta);
  var exec = require('child_process').exec;
  var command = 'casperjs casperDownloader.js "'+meta.downLoadLink+'" "'+meta.fileName+'"';
  console.log('execute command: '+command);
  exec(command,
    function (error, stdout, stderr) {
     if(error)throw error;
      callback();
    });
}


function downloadMovie(savedMovie, callbackDone) {
  var threadHtml;
  var parsedInfos;
  async.series([
    function (next) {
      console.log('save status');
      savedMovie.status = 'get NZB';
      savedMovie.save(function (err) {
        if (err)throw err;
        next();
      });
    },
    function (next) {
      console.log('get html');
      scrawler.getHTML(savedMovie.threadUrl, function (html) {
        threadHtml = html;
        next();
      });
    },
    function (next) {
      console.log('parse html');
      parsedInfos = parser.parseMovie(threadHtml);
      savedMovie = _.assign(savedMovie, parsedInfos);
      savedMovie.save(function (err) {
        if (err)throw err;
        next();
      });
    },
    function (next) {
      console.log('push thx');
      if (parsedInfos.thxLink) {
        scrawler.getHTML(savedMovie.thxLink, function (html) {
          next();
        });
      } else {
        next();
      }
    },
    function (next) {
      console.log('get new html');
      scrawler.getHTML(savedMovie.threadUrl, function (html) {
        console.log('store pw html');
        storePw(html);
        var downloadlink = parser.parseDownloadlink(html);
        console.log('get meta data');
        scrawler.getFileMetaInfo(downloadlink, function (meta) {
          meta.downLoadLink = downloadlink;
          console.log('meta infos');
          console.log(meta);
          savedMovie.fileName = meta.fileName;
          savedMovie.save();
          getFile(meta, next);
        });
      });

    },
    function (next) {
      savedMovie.status = 'done';
      savedMovie.save(function (err) {

        if (err) throw err;
        next();
        callbackDone();
      });
    }
  ]);
}


function check() {
  setTimeout(function () {
    var movies;
    async.series([function (next) {
      Movie.find({status: 'requested'}, function (err, result) {
        movies = result;
        next();
      });

    }, function (next) {
      async.eachSeries(movies, downloadMovie, function (err) {
        if (err) {
          console.log(err);
        }
        next();
        check();
      });
    }
    ]);
  }, 5000);
}

scrawler.init('downloader', function () {

  check();
});
