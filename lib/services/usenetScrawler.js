'use strict';

var phantom = require('phantom'),
  fs = require('fs'),
  EventEmitter = require("events").EventEmitter,
  async = require('async'),
  _ = require('lodash'),
  logger = require('../util/logger.js').create('/project/logfile.log'),
  request = require('request');

var startPage = "http://www.usenetrevolution.info/vb/cmps_index.php?tabid=73?tabid=29";


module.exports = new EventEmitter();


var phantomSession;
var mainPage;
var ready = false;
var owner = "unknown";


function login() {
  var arr = document.getElementsByName("vb_login_username");
  var i;

  for (i = 0; i < arr.length; i++) {
    arr[i].value = "serverlat";


  }
  arr = document.getElementsByName("vb_login_password");


  for (i = 0; i < arr.length; i++) {
    arr[i].value = "Over9000";

  }

  arr = document.getElementById("navbar_loginform");

  arr.submit();

  return arr;
}

function relogin(callback) {
  mainPage.open(startPage, function () {
    mainPage.evaluate(login, function (result) {
      console.log('re login done');
      if (callback)callback(null);
    });
  });
}


function init(name, callback) {
  owner = name;
  if (!ready) {
    async.series([
      function (next) {
        phantom.create(function v(ph) {
          phantomSession = ph;
          next(null);
        });
      }, function (next) {
        console.log('creat phantom');
        phantomSession.createPage(function (page) {
          page.set('settings.loadImages', false);
          mainPage = page;
          next(null);
        });
      }, function (next) {
        console.log('open usenet');
        mainPage.open(startPage, function () {
          next(null);
        });
      }, function (next) {
        console.log('login');
        mainPage.evaluate(login, function (result) {
          console.log('login done');
          next(null);
        });

      }, function (next) {

        console.log('ready' + owner);
        module.exports.emit("ready");
        var ready = true;
        next();
        if (callback)callback();
      }]);
  }

}
module.exports.init = init;


function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}


module.exports.getFileName = function (url, okCallback) {



    phantomSession.createPage(function (page) {

      page.set('onResourceReceived', function (resource) {
        console.log('onResourceReceived');

        resource.headers.forEach(function (header) {
          if (header.name === 'Content-disposition') {


            var fileName = header.value.split("=")[1];
            fileName = replaceAll('"', '', fileName);
            fileName = fileName.trim();
            console.log('onResourceReceived callback');

            okCallback(fileName);
          }
        });
      });

      page.open(url, function (status) {
        page.close();
      });
    });

};

function isSessionExpired(html) {
  return html.indexOf('Du musst zuerst die Forenregeln') > -1;
}

function getHTML(url, callback) {
  phantomSession.createPage(function (page) {
    page.set('settings.loadImages', false);
    page.open(url, function (status) {
      page.evaluate(function () {
        return document.documentElement.outerHTML;
      }, function (result) {
        if (isSessionExpired(result)) {
          console.log('Session is expired, relogin');
          relogin(function () {
            getHTML(url, callback);
          });

        } else {
          callback(result);
          page.close();
        }

      });
    });
  });
}
module.exports.getHTML = getHTML;
