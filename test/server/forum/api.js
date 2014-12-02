'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
  mongoose = require('mongoose'),
  Forum = mongoose.model('Forum');

describe('GET /api/forums', function() {

  before(function(done) {
    var forum = new Forum({
      forumUrl: 'local',
      title: 'http://www.usenetrevolution.info/vb/forumdisplay.php?f=31'
    });

    // Clear users before testing
    Forum.remove().exec();
    forum.save();
    done();
  });


  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/forums')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
