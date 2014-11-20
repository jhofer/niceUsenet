'use strict';

var
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  scrawler = require('./lib/services/usenetScrawler.js'),
  parser = require('./lib/services/forumParser.js'),
  _ = require('lodash'),
  Spooky = require('spooky'),
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



var passwordPath = '/nzb/Passwords.txt';

function storePw(threadHtml){

  var pw = parser.parsePassword(threadHtml);

  if(pw) {
    if(!fs.existsSync(passwordPath)){
      fs.writeFile(passwordPath, '',function (err) {
        if(err) {
          console.log('failed to create file'+passwordPath);
          throw err;
        }
      });
    }
    var currentPws = fs.readFileSync(passwordPath,'utf8');

    if (currentPws.indexOf(pw) === -1) {
      fs.appendFile('/nzb/Passwords.txt', pw + '\r\n', function (err) {
        if (err) {

          console.log('failed to store downloadpw' + pw);
          console.log(err);
        }
      });
    }else{
      console.log('Password '+ pw+' already exists');
    }
  }
}



var spookyConfig = {
  child: {
    transport: 'http'
    //'cookies-file': 'cookies.json'
  },
  casper: {
    logLevel: 'info',
    verbose: true,
    'web-security': 'no'
  }
};




function getFile(savedMovie, callback) {

console.log('filenName '+savedMovie.fileName);

  function destroySpooky(){

  }

  var spooky = new Spooky(
    spookyConfig, function (err) {
      if (err) {
        var e = new Error('Failed to initialize SpookyJS');
        e.details = err;
        throw e;
      }

      spooky.on('path', function(path){
        console.log('LOAD MOVIE FROM:'+path);

      });

      spooky.on('run.complete', function(){
        console.log("NZB downloaded");
        spooky.removeAllListeners();
        callback();
      });




      spooky.start(
        'http://www.usenetrevolution.info/vb/cmps_index.php?tabid=73?tabid=29');
      spooky.thenEvaluate(function () {

        var arr = document.getElementsByName("vb_login_username");
        var i;

        for (i = 0; i < arr.length; i++) {
          arr[i].value = "serverlat";


        }
        arr = document.getElementsByName("vb_login_password");


        for (i = 0; i < arr.length; i++) {
          arr[i].value = "Over9000";

        }

        arr = document.getElementById("navbar_loginform");

        arr.submit();



      });
      spooky.thenOpen(savedMovie.threadUrl);
      spooky.then([savedMovie.toObject(), function () {
        /* jshint ignore:start */
        var downloadPath = this.getElementAttribute('a[href*=attachment]', 'href');
       // var fileName = this.fetchText('.unhiddencontentbox table a');
	    this.capture('screenshot.png');
        this.emit('path', downloadPath);
        this.download(downloadPath, '/nzb/' + fileName);

        /* jshint ignore:end */

      }]);

      spooky.run(function(){
        this.exit();
      });


    });

}


function downloadMovie(savedMovie, callbackDone){
  var threadHtml;
  var parsedInfos;
  async.series([
    function(next) {

      savedMovie.status = 'get NZB';
      savedMovie.save(function(err){
        if(err)throw err;
        next();
      });

    },
    function(next){
      scrawler.getHTML(savedMovie.threadUrl, function (html) {
          threadHtml = html;
          next()
      });

    },
    function(next){
      parsedInfos = parser.parseMovie(threadHtml);
      savedMovie= _.assign(savedMovie,parsedInfos );
      savedMovie.save(function(err){
        if(err)throw err;
        next();
      });
    },
    function(next){
      if (parsedInfos.thxLink) {
        scrawler.getHTML(savedMovie.thxLink, function (html) {
          next();
        });
      }else{
        next();
      }
    },
    function(next){
      scrawler.getHTML(savedMovie.threadUrl, function (html) {
        storePw(html);
        var downloadlink = parser.parseDownloadlink(html);
        scrawler.getFileMetaInfo(downloadlink, function(meta){
          savedMovie.fileName = meta.fileName;
          savedMovie.save();
          getFile(savedMovie,next);
        });
      });

    },
    function(next){
      savedMovie.status = 'done';
      savedMovie.save(function(err){
        if(err)throw err;
        next();
        callbackDone();
      });
    }
  ]);
}



function check(){
  setTimeout(function() {
    var movies;
    async.series([function(next){
      Movie.find({status: 'requested'}, function(err, result){
        movies = result;
        next();
      });

    }, function (next){
      async.eachSeries(movies, downloadMovie, function (err) {
        if(err){
          console.log(err);
        }
        next();
        check();
      });
    }
    ]);
  }, 5000);
}

scrawler.init(function(){
  check();
});
