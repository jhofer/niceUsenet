'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Movie = mongoose.model('Movie');

var movie;

describe('Movie Model', function() {
  before(function(done) {
    movie = new Movie({
      title: 'awesome movie.js',
      threadUrl: 'url',
      forumUrl: '31',
      thxLink: 'url'
    });

    // Clear movies before testing
    Movie.remove().exec();
    done();
  });

  afterEach(function(done) {
    Movie.remove().exec();
    done();
  });

  it('should begin with no movies', function(done) {
    Movie.find({}, function(err, movies) {
      movies.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate movie.js', function(done) {
    movie.save();
    var movieDup = new Movie(movie);
    movieDup.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should fail when saving without an title', function(done) {
    movie.title = '';
    movie.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should save a json object', function(done){
    var json = {
      title: 'awesome movie.js',
      threadUrl: 'url',
      forumUrl: '31',
      thxLink: 'url'



    };

    var movie = new Movie(json);
    movie.save(function  (err) {
        should.not.exist(err);

      Movie.find({threadUrl: json.threadUrl}, function (err, savedmovie) {
        savedmovie.should.have.length(1);
        console.log(JSON.stringify(savedmovie));
        done();
      });

    });
  });



});
