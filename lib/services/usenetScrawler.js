'use strict';

var phantom = require('phantom');
var fs = require('fs');
var EventEmitter = require("events").EventEmitter;
var async = require('async');
var _ = require('lodash');
var request = require('request');
var Spooky = require('spooky');

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

module.exports.init = function (callback) {
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
        mainPage.open("http://www.usenetrevolution.info/vb/cmps_index.php?tabid=73?tabid=29", function () {
          next(null);
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
          console.log('login done');
          next(null);
        });

      }, function (next) {
        module.exports.emit("ready");
        var ready = true;
        next();
        if(callback)callback();
      }]);
  }

};


function getHTML(url, callback) {
  phantomSession.createPage(function (page) {
    page.set('settings.loadImages', false);
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





function downloadWithSpooky(name, url){
  console.log(name+' '+url);
  var spooky = new Spooky({
    child: {
      transport: 'http'
    },
    casper: {
      logLevel: 'info',
      verbose: true,
      'web-security': 'no'
    }
  }, function (err) {
    if (err) {
      var e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }

    spooky.on('download', function(path){
     fs.writeFile('spooky.html', path);
    });

    spooky.start(
      'http://www.usenetrevolution.info/vb/cmps_index.php?tabid=73?tabid=29');
    spooky.then(function () {
      if (this.exists('input[id="vb_login_username"]')) {
                this.fill('form', {
                  'vb_login_username': 'serverlat',
                    'vb_login_password': 'Over9000'
                }, true);
            }
    });
    spooky.thenOpen(url);
    spooky.then(function () {
      /* jshint ignore:start */
      var downloadPath = this.getElementAttribute('.unhiddencontentbox table a', 'href');
      var fileName = this.fetchText('.unhiddencontentbox table a');
      //this.emit('download', function () {
      //  return this.fetchText('.unhiddencontentbox table a');
      //});


      this.download(downloadPath, '/nzb/'+fileName);
      /* jshint ignore:end */
    });
    spooky.run(function(){
      this.echo('Done.').exit();
    });
  });
}




module.exports.getHTML = getHTML;
function download(movie) {
  console.log('scrawler start download' + movie.downloadLink);
  downloadWithSpooky(movie.title+'.nzb', movie.threadUrl);

  //phantomSession.createPage(function (page) {
  //  page.set('settings.loadImages', false);
  //  page.set('onResourceReceived', function(response){
  //    var
  //    if (response.contentType && response.stage === 'end')  {
  //        fs.writeFile('response.json',JSON.stringify(response));
  //    }
  //  });
  //
  //
  //  page.open(movie.downloadLink);

  //});
}
module.exports.download = download;

