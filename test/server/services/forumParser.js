'use strict';

var forumParser = require('../../../lib/services/forumParser.js'),
  should = require('should'),
  fs = require('fs');


describe('forumParser', function () {
  var moviesHtml;
  var movieHtml;
  before(function (done) {
    fs.readFile('test/server/services/forumHtmlTestFile.html', function (err, data) {
      if (err) throw err;
      moviesHtml = data;


      fs.readFile('test/server/services/threadHtmlTestFile.html', function (err, data) {
        movieHtml = data;
        done();
      });


    });
  });


  describe('parseMovies', function () {
    var movies;
    before(function () {
      movies = forumParser.parseMovies(moviesHtml);
    });

    it('should return an array of movie objects', function (done) {
      movies.should.be.an.instanceOf(Array);
      movies.should.have.length(40);
      movies[0].should.have.property('title', 'Fields of the Dead 2014 German DL 1080p BluRay x264 iFPD');
      movies[0].should.have.property('image', 'http://www.usenetrevolution.info/picupload/uploads/2014/10/i103199b6cq76.jpg');
      movies[0].should.have.property('threadUrl', 'showthread.php?242057-Fields-of-the-Dead-2014-German-DL-1080p-BluRay-x264-iFPD');
      done();
    });

    it('it should have a property title filled', function () {

    })

  });

  describe('parseMovie', function () {
    var movie;
    before(function () {
      movie = forumParser.parseMovies(movieHtml);
    });


    it('should return', function (done) {
      done();
    })
  });
});
