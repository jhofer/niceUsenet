'use strict';

var path = require('path'),
  usenet = require('./../services/usnetScrawler.js'),
  forumParser = require('./../services/forumParser.js');


/**
 * Send partial, or 404 if it doesn't exist
 */
exports.partials = function(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function(err, html) {
    if(err) {
      console.log("Error rendering partial '" + requestedView + "'\n", err);
      res.status(404);
      res.send(404);
    } else {
      res.send(html);
    }
  });
};

/**
 * Send our single page app
 */
exports.index = function(req, res) {
    // res.render('index');



  usenet.requestForumHtml(39, function(html){
    res.render(html);
   // var threads = forumParser.parseMovies(html);
    //
  /*  _.each(threads,function(thread){
      usenet.requestThreadHtml(thread.threadUrl, function(html){

        return res.send(html);
        // var thread = forumParser.parseMovie(html);

        res.render(html);
      });
    });*/



    //  return res.json(threads);
  });
};
