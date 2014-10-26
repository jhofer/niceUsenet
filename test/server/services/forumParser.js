'use strict';

var forumParser = require('../../../lib/services/forumParser.js'),
    should = require('should'),
     fs = require('fs');




describe('forumParser', function  () {
  describe('parserMoves', function (){
    it('should return an array of movie objects',function (done) {
      fs.readFile('test/server/services/forumHtmlTestFile.html', function  (err, data) {
        if (err) throw err;
        var result = forumParser.parseMovies(data);
        result.should.be.an.instanceOf(Array);
        result.should.have.length(40);
        result[0].should.have.property('title', 'Fields of the Dead 2014 German DL 1080p BluRay x264 iFPD');
        result[0].should.have.property('image', 'http://www.usenetrevolution.info/picupload/uploads/2014/10/i103199b6cq76.jpg');
        result[0].should.have.property('threadUrl', 'showthread.php?242057-Fields-of-the-Dead-2014-German-DL-1080p-BluRay-x264-iFPD');


        done();
      });

    });





  });
});
