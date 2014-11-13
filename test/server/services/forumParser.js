'use strict';

var forumParser = require('../../../lib/services/forumParser.js'),
  should = require('should'),
  fs = require('fs'),
  async = require('async');


describe('forumParser', function () {
  var moviesHtml;
  var movieHtml;
  var imdbHtml;

  var thxHtml;
  before(function (done) {

    async.parallel([
      function (callback) {
        fs.readFile('test/server/services/forumHtmlTestFile.html', function (err, data) {
          if (err) throw err;
          moviesHtml = data;
          callback();
        });
      }, function (callback) {
        fs.readFile('test/server/services/threadHtmlTestFile.html', function (err, data) {
          movieHtml = data;
          callback();
        });
      }, function (callback) {
        fs.readFile('test/server/services/imdbHtmlTestFile.html', function (err, data) {
          imdbHtml = data;
          callback();
        });
      }, function (callback) {
        fs.readFile('test/server/services/afterThxTestFile.html', function (err, data) {
          thxHtml = data;
          callback();
        });
      }


    ], function () {
      done();
    });


  });


  describe('parseMovies', function () {
    var movies;
    before(function () {
      movies = forumParser.parseMovies(moviesHtml);
    });

    it('should return an array of movie.js objects', function () {
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
      movies[0].should.have.property('threadUrl', 'http://www.usenetrevolution.info/vb/showthread.php?242057-Fields-of-the-Dead-2014-German-DL-1080p-BluRay-x264-iFPD');
    });


  });

  describe('parseMovie', function () {
    var movie;
    before(function () {
      movie = forumParser.parseMovie(movieHtml);
    });


    it('should have property thxLink filled', function () {
      movie.should.have.property('thxLink', 'http://www.usenetrevolution.info/vb/post_thanks.php?do=post_thanks_add&p=300720&securitytoken=1414392593-2361034f84efb668c873006a79c3ff45768ad5fd');
    });

    it('should have property imdbLink filled', function () {
      movie.should.have.property('imdbLink', 'http://www.imdb.com/title/tt3186838');
    });

  });

  describe('parseImdb', function () {

    var imdb;
    before(function () {
      imdb = forumParser.parseImdb(imdbHtml);
    });

    it('should have property raiting filled', function () {
      imdb.should.have.property('rating', 2.8);
    });

    it('should have property genres filled', function () {
      imdb.should.have.property('genres');
      imdb.genres.should.be.an.instanceOf(Array);
      imdb.genres.should.have.length(1);
      imdb.genres[0].should.contain('Horror');
    });
  });

  //
  //describe('parseDownloadLink', function(){
  //  var thx;
  //  before(function(){
  //    thx = forumParser.parseDownloadInfos(thxHtml);
  //  });
  //
  //  it('should return the download Link', function(){
  //    thx.should.have.property('downloadLink','http://www.usenetrevolution.info/vb/attachment.php?attachmentid=274712&d=1414596607');
  //  });
  //
  //  it('should return the download password', function(){
  //    thx.should.have.property('password','UsenetRevolution');
  //  });
  //});


});
