'use strict';


var request = require('request').defaults({jar: true}),
  _ = require('underscore-node'),
  cheerio = require('cheerio'),
  parser = require('./forumParser');

console.log('loaded requirement');
var globalHeader;
var EventEmitter = require('events').EventEmitter;

module.exports = new EventEmitter();


function acceptForumRules(headers) {
  request.post(
    {
      url: 'http://www.usenetrevolution.info/vb/misc.php?do=vsaafragree',
      header: headers,
      form: {
        cfrset: '1',
        cafr_agree: '1',
        vsaafr_counter: 'Abschicken'
      }
    },
    function (err, response) {
      console.log(headers);
      globalHeader = response.headers;


      request({url:'http://www.usenetrevolution.info/vb/showthread.php?242832-Tarzan-2013-German-DL-1080p-BluRay-x264-EXQUiSiTE'}, function(err, response, body){

      });



      module.exports.emit('ready');
    });
}

console.log('define' + 'readForumRules');

function readForumRules(headers) {

  request({url: 'http://www.usenetrevolution.info/vb/misc.php?do=vsarules&doredir=1&cfrset=1', header: headers}, function (err, response) {
    // callback.send(html);
    acceptForumRules(response.headers);

  });

}

console.log('define' + 'login');

function login(headers) {

  console.log('now login');

  request.post(
    {
      url: 'http://www.usenetrevolution.info/vb/login.php',

      header: headers,
      form: {
        vb_login_username: 'serverlat',
        vb_login_password: 'Over9000'
      }
    },
    function (err, response) {


      readForumRules(response.headers);

    });


}


function acceptRules(okLink, headers) {

  request(
    {
      url: okLink,

      header: headers

    }, function (err, response) {
      login(response.headers);
    });
}


console.log('make first request');

request(
  {
    url: 'http://www.usenetrevolution.info'

  }, function (err, response, html) {

    console.log('caled' + 'http://www.usenetrevolution.info');
    var $ = cheerio.load(html);
    var links = [];
    $('a').each(function (i, element) {
      var link = $(element);
      links.push(link.attr('href'));

    });


    var okLink = _.find(links, function (link) {
      return link.indexOf('cmps_index.php') > -1;
    });


    acceptRules(okLink, response.headers);
  });




 function requestThreadHtml(threadUrl, callback) {


request({url: 'http://usenetrevolution.info/vb/'+threadUrl, header: globalHeader}, function (err, response, html) {

    globalHeader = response.headers;
    callback(html);
  });
};

module.exports.requestThreadHtml = requestThreadHtml


module.exports.requestForumHtml = function requestForumHtml(forumId, callback) {


  request({
    url: 'http://www.usenetrevolution.info/vb/forumdisplay.php?f=' + forumId,
    header: globalHeader
  }, function (err, response, html) {
    globalHeader = response.headers;








    callback(html);
  });
};
