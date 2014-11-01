'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Movie = mongoose.model('Movie');

var movie;

describe('Movie Model', function() {
  before(function(done) {
    movie = new Movie({
      title: 'Fake Movie'
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

  it('should fail when saving a duplicate movie', function(done) {
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
    var json = {};
    json.title="awesome movie"
    var movie = new Movie(json);
    movie.save(function  (err) {
        should.not.exist(err)
        done();
    });



  });



});
