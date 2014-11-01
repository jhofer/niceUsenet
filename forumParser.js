'use strict'

var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  usenet = require('./lib/services/usenetScrawler.js'),
  forumParser = require('./lib/services/forumParser.js'),
  _ = require('lodash');




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

/*

usenet.on('ready', function() {
  usenet.requestForumHtml(39, function(html) {
    console.log('parse hd forum');

    var threads = forumParser.parseMovies(html);

    _.each(threads, function (thread) {

      usenet.requestThreadHtml(thread.threadUrl, function (html) {

        var threadO = forumParser.parseMovie(html);

        var imdb = forumParser.parseImdb(threadO.imdbLink);
        var movieInfos =   _.merge(threadO, imdb, thread);

     //   console.log(movieInfos);
      });
    });



  });


});
*/

var phantom=require('node-phantom');
phantom.create(function(err,ph) {
  return ph.createPage(function(err,page) {
    return page.open("http://tilomitra.com/repository/screenscrape/ajax.html", function(err,status) {
      console.log("opened site? ", status);
      page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(err) {
        //jQuery Loaded.
        //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
        setTimeout(function() {
          return page.evaluate(function() {
            //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object.
            var h2Arr = [],
              pArr = [];
            $('h2').each(function() {
              h2Arr.push($(this).html());
            });
            $('p').each(function() {
              pArr.push($(this).html());
            });

            return {
              h2: h2Arr,
              p: pArr
            };
          }, function(err,result) {
            console.log(result);
            ph.exit();
          });
        }, 5000);
      });
    });
  });
});



