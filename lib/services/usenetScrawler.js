'use strict';

var Spooky = require('spooky');
var callbackFunctions = {};
var spooky = new Spooky({
  child: {
    command: 'casperjs.cmd',
    transport: 'http'
  },
  casper: {
    logLevel: 'debug',
    verbose: true
  }
}, function (err) {
  if (err) {
    e = new Error('Failed to initialize SpookyJS');
    e.details = err;
    throw e;
  }

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


  spooky.on('loadUrl', function (url){
    console.log('passed url'+url);

    spooky.thenOpen(url);
    spooky.then(function(){
      this.emit('htmlLoaded', this.getHTML(), url);

    });
    spooky.run();

  });


  spooky.run();
});



spooky.on('htmlLoaded', function(html, url){
  callbackFunctions[url](html);
});

spooky.on('error', function (e, stack) {
  console.error(e);

  if (stack) {
    console.log(stack);
  }
});


// Uncomment this block to see all of the things Casper has to say.
// There are a lot.
// He has opinions.

 spooky.on('console', function (line) {
 console.log(line);
 });



//
//spooky.on('log', function (log) {
//  if (log.space === 'remote') {
//    console.log(log.message.replace(/ \- .*/, ''));
//  }
//});

module.exports.getHTML = function getHTML(url, callback){
  callbackFunctions[url] =callback;
  console.log('pass url to spooky '+url);
  spooky.emit('loadUrl',url);

};
