'use strict';

var
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  scrawler = require('./lib/services/usenetScrawler.js'),
  parser = require('./lib/services/forumParser.js'),
  _ = require('lodash'),
  async = require('async'),
  logger = require('./lib/util/logger.js').create('/project/logfile.log'),
  passwordPath = '/nzb/Passwords.txt';



// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});





function getSimpleDate(){
  var now = new Date();
  return  now.getYear()+''+now.getMonth()+''+now.getDate()+''+now.getHours()+''+now.getMinutes()+''+now.getSeconds();
}

var Movie = mongoose.model('Movie');
Movie.find(function (err, movies) {

  movies.forEach(function(movie){
    if(movie.status !== 'done'){
      movie.status = 'download';
      movie.save();
    }

  });
  logger.log('clean done');
});





function storePw(threadHtml) {

  var pw = parser.parsePassword(threadHtml);

  if (pw) {
    if (!fs.existsSync(passwordPath)) {
      fs.writeFile(passwordPath, '', function (err) {
        if (err) {
          logger.log('failed to create file' + passwordPath);
          throw err;
        }
      });
    }
    var currentPws = fs.readFileSync(passwordPath, 'utf8');

    if (currentPws.indexOf(pw) === -1) {
      fs.appendFile('/nzb/Passwords.txt', pw + '\r\n', function (err) {
        if (err) {

          logger.log('failed to store downloadpw' + pw);
          logger.log(err);
        }
      });
    } else {
      logger.log('Password ' + pw + ' already exists');
    }
  }
}



function getFile(meta, callback) {

  logger.log('download with casper');
  logger.log(meta);
  var exec = require('child_process').exec;
  var command = 'casperjs casperDownloader.js "'+meta.downLoadLink+'" "'+meta.fileName+'"';
  logger.log('execute command: '+command);
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
      logger.log('save status');
      savedMovie.status = 'get NZB';
      savedMovie.save(function (err) {
        if (err)throw err;
        next();
      });
    },
    function (next) {
      logger.log('get html');
      scrawler.getHTML(savedMovie.threadUrl, function (html) {
        threadHtml = html;
        next();
      });
    },
    function (next) {
      logger.log('parse html');
      parsedInfos = parser.parseMovie(threadHtml);
      savedMovie = _.assign(savedMovie, parsedInfos);
      savedMovie.save(function (err) {
        if (err)throw err;
        next();
      });
    },
    function (next) {

      if (parsedInfos.thxLink) {
        logger.log('push thx');
        scrawler.getHTML(savedMovie.thxLink, function (html) {
          next();
        });
      } else {
        logger.log('thx allready pushed');
        next();
      }
    },
    function (next) {
      logger.log('get new html');
      scrawler.getHTML(savedMovie.threadUrl, function (html) {
        logger.log('store pw html');
        storePw(html);
        var downloadlink = parser.parseDownloadlink(html);

        if(downloadlink){
          logger.log('get filename');
        scrawler.getFileName(downloadlink, function (fileName) {
          var meta = {
            downLoadLink : downloadlink,
            fileName : fileName
          };

          logger.log(meta);
          savedMovie.fileName = fileName;
          savedMovie.status = 'done';
          getFile(meta, next);
        });
        }else{
          savedMovie.status = 'failed';
          var fileName = 'unparsable'+getSimpleDate()+'.html';
          logger.err('cant parse download url. check: '+fileName);

          fs.writeFile(fileName, html, function (err) {
            if (err) throw err;
          });

          next();
        }
      });

    },
    function (next) {
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
          logger.err(err);
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
