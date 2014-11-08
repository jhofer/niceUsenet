'use strict';

var phantom = require('phantom');
var fs = require('fs');
var EventEmitter = require("events").EventEmitter;
var async = require('async');

module.exports = new EventEmitter();


var phantomSession;
var mainPage;

var ready = false;

function savePageContent(page, title, callback) {
  page.evaluate(function () {
    return document.documentElement.outerHTML;
  }, function (result) {
    fs.writeFile(title, result);
    if (callback) {
      callback();
    }

  });

}

module.exports.init = function () {
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
          mainPage = page;
          next(null);
        });
      }, function (next) {
        console.log('open usenet');
        mainPage.open("http://www.usenetrevolution.info", function () {
          next(null);
        });
      }, function (next) {
        console.log('accept');
        mainPage.evaluate(function () {
          //
          //var arr = document.getElementsByName("a");
          //var i;
          //
          //for (i=0; i < arr.length; i++) {
          //  if (arr[i].getAttribute('method') == "POST") {
          //    arr[i].submit();
          //    return 1;
          //  }
          //}


          return "http://www.usenetrevolution.info/vb/cmps_index.php?tabid=73?tabid=29";

        }, function (link) {
          console.log('link' + link);
          mainPage.open(link, function () {
            savePageContent(mainPage, 'afterAccept.html');
            next(null);
          });
        });
      }, function (next) {
        console.log('login');
        mainPage.evaluate(function () {

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

        }, function (result) {
          savePageContent(mainPage, "wasischads.html");
          console.log(result);

          next(null);
        });

      }, function (next) {
        module.exports.emit("ready");
        var ready = true;
        next();
      }]);
  }

};


function getHTML(url, callback) {
  phantomSession.createPage(function (page) {
    page.open(url, function (status) {

      page.evaluate(function () {
        return document.documentElement.outerHTML;
      }, function (result) {
        callback(result);
        page.close();
      });
    });
  });
}

module.exports.getHTML = getHTML;

function download(downloadInfos) {
  console.log('scrawler start download' + downloadInfos.downloadFile);
  phantomSession.createPage(function (page) {
    page.open(downloadInfos.downloadFile, function (status) {
      console.log('download started do more stuff');
    });
  });
}
module.exports.download = download;

