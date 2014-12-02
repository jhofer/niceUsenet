'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
  mongoose = require('mongoose'),
  Forum = mongoose.model('Forum'),
  User = mongoose.model('User');
var agent;
describe('Rest API /api/forums', function() {

  before(function(done) {
    // Clear users before testing
    Forum.remove().exec();


    var forum1 = new Forum({
      forumUrl:'http://www.usenetrevolution.info/vb/forumdisplay.php?f=31',
      title: 'fake Forum1'
    });
    forum1.save();


    var forum2 = new Forum({
      forumUrl:'http://www.usenetrevolution.info/vb/forumdisplay.php?f=32',
      title: 'fake Forum2'
    });
    forum2.save();


    // Clear old users, then add a default user
    User.find({}).remove(function() {
      User.create({
          provider: 'local',
          name: 'serverlat',
          email: 'serverlat.server@gmail.com',
          password: 'Over9000',
          admin: true
        }, function() {
          done();
        }
      );
    });




  });

  it('should login',function(done){
    agent =  request.agent(app);
    agent
      .post('/api/session')
      .send({ email: 'serverlat.server@gmail.com', password: 'Over9000' })
      .expect(200)
      .end(function(err, res) {

        if (err) {return done(err);}

        done();
      });
  });


  it('should get own session',function(done){

    agent
      .get('/api/users/me')
      .expect(200)
      .end(function(err, res) {
        // user1 will manage its own cookies
        // res.redirects contains an Array of redirects
        res.body.should.be.ok;
        if (err) {return done(err);}

        done();
      });
  });


  it('should respond with inital forums GET', function(done) {
    agent
      .get('/api/forums')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {return done(err);}
        res.body.should.be.instanceof(Array).and.have.lengthOf(2);
        done();
      });
  });


  it('should SAVE new forum PUT', function(done){

    agent
      .put('/api/forums')
      .send({  forumUrl:'http://www.usenetrevolution.info/vb/forumdisplay.php?f=33',
                title: 'fake Forum3' })
      .expect(200)
      .end(function(err) {
        if (err) {return done(err);}
        done();
      });

  });

  it('should return the new forum GET', function(done) {
    agent
      .get('/api/forums')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {return done(err);}
        res.body.should.be.instanceof(Array).and.have.lengthOf(3);
        done();
      });
  });


  var updateForum = {  forumUrl:'http://www.usenetrevolution.info/vb/forumdisplay.php?f=33',
    title: 'super forum' };

  it('should UPDATE new forum with PUT', function(done){

    agent
      .put('/api/forums')
      .send(updateForum)
      .expect(200)
      .end(function(err) {
        if (err) {return done(err);}
        done();
      });

  });

  var todeleteId
  it('should return the updated forum GET', function(done) {
    agent
      .get('/api/forums')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {return done(err);}
        res.body.should.be.instanceof(Array).and.have.lengthOf(3);
        res.body[2].should.have.property('title','super forum');
        todeleteId =res.body[2]._id;
        done();
      });
  });


  it('should DELETE a forum DEL', function(done) {
    agent
      .del('/api/forums/'+todeleteId)
      .expect(200)
      .end(function(err) {
        if (err) {return done(err);}
        done();
      });
  });

  it('should return the reduced forum list', function(done) {
    agent
      .get('/api/forums')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {return done(err);}
        res.body.should.be.instanceof(Array).and.have.lengthOf(2);
        done();
      });
  });


});
