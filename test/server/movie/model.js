'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Movie = mongoose.model('Movie');

var movie;

describe('Movie Model', function() {
  before(function(done) {
    movie = new Movie({
      name: 'Fake Movie'     
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

  it('should fail when saving without an name', function(done) {
    movie.name = '';
    movie.save(function(err) {
      should.exist(err);
      done();
    });
  });



});