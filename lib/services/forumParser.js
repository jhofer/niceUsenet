'use strict';
var cheerio = require('cheerio');


module.exports.parseMovies = function parseMovies(html) {
  var $ = cheerio.load(html);
  var movies = [];
  $('.threadinfo').each(function (i, element) {

    var image = $(element).find('a.threadstatus img.preview').attr('src');
    console.log($(element).html());
    var title = $(element).find('.inner h3 a.title').html();
    var threadUrl = $(element).find('.inner h3 a.title').attr('href');
    if (title && title.indexOf('Postingregeln') === -1) {
      movies.push({
        image: image,
        title: title,
        threadUrl: threadUrl
      });
    }


  });
  return movies;

};


module.exports.parseMovie = function parseMovie(html) {


  var $ = cheerio.load(html);

  var movie = {};

  return movie;

};



