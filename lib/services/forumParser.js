'use strict';
var cheerio = require('cheerio'),
    _ = require('lodash');


module.exports.parseMovies = function parseMovies(html) {
  var $ = cheerio.load(html);
  var movies = [];
  $('.threadinfo').each(function (i, element) {

    var image = $(element).find('a.threadstatus img.preview').attr('src');

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


  var thxLink = $('a.post_thanks_button').attr('href');
  var imdbLink = "";
  $('a').each(function (i, element){
    var link = $(element).attr('href');
    if(_.contains(link, "imdb")){
      imdbLink = link;
    }
  });

  var movie = {
    thxLink: thxLink,
    imdbLink: imdbLink
  };

  return movie;

};


module.exports.parseImdb = function parseImdb(html){
  var imdb ={
    rating: 2.8
  };

  return imdb;
}



