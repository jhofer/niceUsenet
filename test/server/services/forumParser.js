'use strict';

var forumParser = require('../../../lib/services/forumParser.js'),
  should = require('should'),
  fs = require('fs');


describe('forumParser', function () {
  var moviesHtml;
  var movieHtml;
  var imdbHtml;
  before(function (done) {
    fs.readFile('test/server/services/forumHtmlTestFile.html', function (err, data) {
      if (err) throw err;
      moviesHtml = data;


      fs.readFile('test/server/services/threadHtmlTestFile.html', function (err, data) {
        movieHtml = data;

          fs.readFile('test/server/services/imdbHtmlTestFile.html', function (err, data) {
           imdbHtml = data;
            done();
          });


       
      });


    });
  });


  describe('parseMovies', function () {
    var movies;
    before(function () {
      movies = forumParser.parseMovies(moviesHtml);
    });

    it('should return an array of movie objects', function () {
      movies.should.be.an.instanceOf(Array);
      movies.should.have.length(40);
    });

    it('should have a property title filled', function () {
      movies[0].should.have.property('title', 'Fields of the Dead 2014 German DL 1080p BluRay x264 iFPD');
    });

    it('should have a property image filled', function () {
      movies[0].should.have.property('image', 'http://www.usenetrevolution.info/picupload/uploads/2014/10/i103199b6cq76.jpg');
    }); 

    it('should have a property image threadUrl', function () {
      movies[0].should.have.property('threadUrl', 'showthread.php?242057-Fields-of-the-Dead-2014-German-DL-1080p-BluRay-x264-iFPD');
    });    



  });

  describe('parseMovie', function () {
    var movie; 
    before(function () {
      movie = forumParser.parseMovies(movieHtml);
    });


    it('should have property thxLink filled', function () {
       movie.should.have.property('thxLink', 'http://www.usenetrevolution.info/vb/post_thanks.php?do=post_thanks_add&p=300720&securitytoken=1414392593-2361034f84efb668c873006a79c3ff45768ad5fd');
    });

    it('should have property imdbLink filled', function () {
       movie.should.have.property('imdbLink', 'http://www.usenetrevolution.info/vb/redirector.php?url=http%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt3186838');
    });

  });

  describe('parseImdb', function () {

    var imdb; 
    before(function () {
      imdb = forumParser.parseMovies(imdbHtml);
    });

    it('should have property raiting filled', function  () {
     movie.should.have.property('imdbLink', 'http://www.usenetrevolution.info/vb/redirector.php?url=http%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt3186838');
    });
  });

  
});
