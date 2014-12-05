'use strict';

var should = require('should'),
 Queue = require('../../../../lib/util/collections/Queue.js');

var queue;

describe('Class Queue', function() {
  before(function(done) {
    queue = new Queue(5);
    done();
  });


  it('should begin with no items', function(done) {
    queue.size().should.be.exactly(0);
      done();
  });

  it('should add new items to the queue', function(done) {
      queue.add(1);
      queue.size().should.be.exactly(1);
      queue.add(2);
    queue.size().should.be.exactly(2);
      queue.add(3);
    queue.size().should.be.exactly(3);
      queue.add(4);
    queue.size().should.be.exactly(4);
      queue.add(5);
    queue.size().should.be.exactly(5);
      done();
  });


  it('should be full', function(done) {
    queue.size().should.be.exactly(5);
    queue.isFull().should.be.true;
    done();
  });


  it('should return a copy of the array', function(done) {
    var array = queue.content();
    array.length.should.be.exactly(5);
    array.push("val");
    queue.size().should.be.exactly(5);
    done();
  });



  it('should remove the oldest from the queue if full', function(done) {
    queue.add(6);
    queue.size().should.be.exactly(5);
    done();
  });

  it('should return the oldest', function(done) {
    queue.next().should.be.exactly(2);
    queue.next().should.be.exactly(3);
    queue.next().should.be.exactly(4);
    queue.next().should.be.exactly(5);
    queue.next().should.be.exactly(6);
    done();
  });

  it('should be empty', function(done) {
    queue.size().should.be.exactly(0);
    queue.isEmpty().should.be.true;
    done();
  });



});
