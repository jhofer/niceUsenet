'use strict';

var phantom = require('phantom'),
  fs = require('fs'),
  EventEmitter = require("events").EventEmitter,
  async = require('async'),
  _ = require('lodash'),
  request = require('request');

var startPage = "http://www.usenetrevolution.info/vb/cmps_index.php?tabid=73?tabid=29";


 module.exports = new EventEmitter();


var phantomSession;
var mainPage;
var ready = false;
var owner = "unknown";





function login(){
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

        console.log('ready'+owner);
        module.exports.emit("ready");
        var ready = true;
        next();
        if(callback)callback();
      }]);
  }

}
module.exports.init = init;


function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}


module.exports.getFileMetaInfo = function(url, callback){

  console.log('getFileMetaInfo'+url);

  phantomSession.createPage(function (page) {

    page.set('onResourceReceived', function (resource) {
      console.log('onResourceReceived');
      var infos = {};
      resource.headers.forEach(function(header){
        if(header.name ==='Content-disposition'){


          infos.fileName = header.value.split("=")[1];
          infos.fileName = replaceAll('"','', infos.fileName );
          infos.fileName = infos.fileName.trim();
          console.log('onResourceReceived callback');

          callback(infos);
        }
      });




    });

    page.open(url, function (status) {
      page.close();
    });
  });
};

function isSessionExpired(html){

  return html.indexOf('Du musst zuerst die Forenregeln lesen und akzeptieren bevor es weitergeht!')>-1;

}

function getHTML(url, callback) {
  phantomSession.createPage(function (page) {
    page.set('settings.loadImages', false);
    page.open(url, function (status) {
      page.evaluate(function () {
        return document.documentElement.outerHTML;
      }, function (result) {
        if(isSessionExpired(result)){
          console.log('Session is expired, reinit scrawler');
          init(owner, function(){
            getHTML(url, callback);
          });
        }else{
          callback(result);
          page.close();
        }

      });
    });
  });
}
module.exports.getHTML = getHTML;
