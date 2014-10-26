'use strict';


var request = require('request').defaults({jar: true}),
  _ = require('underscore-node'),
  cheerio = require('cheerio'),
  j = request.jar();
var EventEmitter = require('events').EventEmitter;

module.exports = new EventEmitter();


function acceptForumRules() {
  request.post(
    {
      url: 'http://www.usenetrevolution.info/vb/misc.php?do=vsaafragree',
      jar: j,
      form: {
        cfrset: '1',
        cafr_agree: '1',
        vsaafr_counter: 'Abschicken'
      }
    },
    function (err, httpResponse) {
      module.exports.emit('ready');
    });
}

console.log('define' + 'readForumRules');

function readForumRules() {

  request({url: 'http://www.usenetrevolution.info/vb/misc.php?do=vsarules&doredir=1&cfrset=1', jar: j}, function () {
    // callback.send(html);
    acceptForumRules();

  });

}

console.log('define' + 'login');

function login() {

  console.log('now login');

  request.post(
    {
      url: 'http://www.usenetrevolution.info/vb/login.php',
      jar: j,
      form: {
        vb_login_username: 'serverlat',
        vb_login_password: 'Over9000'
      }
    },
    function (err, httpResponse) {


      readForumRules();

    });


}


function acceptRules(okLink) {

  request(
    {
      url: okLink,
      jar: j

    }, function () {
      login();
    });
}


console.log('make first request');

request(
  {
    url: 'http://www.usenetrevolution.info',
    jar: j,
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


    acceptRules(okLink);
  });


module.exports.requestForumHtml = function requestForumHtml(forumId, callback) {


  request({
    url: 'http://www.usenetrevolution.info/vb/forumdisplay.php?f=' + forumId,
    jar: j
  }, function (err, response, html) {

    callback(html);
  });
};


module.exports.requestThreadHtml = function requestThreadHtml(threadUrl, callback) {
  request({url: threadUrl, jar: j}, function (err, response, html) {

    callback(html);
  });
};
