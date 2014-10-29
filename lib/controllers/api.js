'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Thing = mongoose.model('Thing'),
    usenet = require('./../services/usnetScrawler.js'),
    forumParser = require('./../services/forumParser.js');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};



exports.hdmovies = function(req, res) {


   usenet.requestForumHtml(39, function(html){

        var threads = forumParser.parseMovies(html);
        //
        _.each(threads,function(thread){
               usenet.requestThreadHtml(thread.threadUrl, function(html){

                 return res.send(html);
                            // var thread = forumParser.parseMovie(html);

                 res.render(html);
               });
        });



   //  return res.json(threads);
	});
};
