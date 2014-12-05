'use strict';

var fs = require('fs');


function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function f(num) {
  return pad(num, 2);
}

function getTimestamp() {
  var d = new Date();
  var date = f(d.getDate());
  var month = f(d.getMonth());
  var year = f(d.getFullYear());
  var hours = f(d.getHours());
  var minutes = f(d.getMinutes());
  var seconds = f(d.getSeconds());
  var milis = pad(d.getMilliseconds(),3);

  return date + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milis;
}


function createLogFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFile(filePath, '', function (err) {
      if (err) {
        throw err;
      }
    });
  }
}

function save(logStatement, path) {
  var nl = '<br />' + '\r\n';
  fs.appendFile(path, logStatement + nl, function (err) {
    if (err)throw err;
  });
}

function log(text, color, path) {
  var time = getTimestamp(),
    logStatement = time + ': <strong style="color:' + color + '">' + text + '</strong>';
  save(logStatement, path);
}


function Logger(path) {
  createLogFile(path);
  this.path = path;

}

Logger.prototype.info = function (text) {
  log(text, 'black', this.path);
};

Logger.prototype.log = function (text) {
  log(text, 'black', this.path);
};


Logger.prototype.err = function (err) {
  log(err, 'red', this.path);
};

Logger.prototype.success = function (err) {
  log(err, 'green', this.path);
};


var loggers = {};

//pipe all console.log to to all registreded loggers
(function () {

  var originallog = console.log;

  console.log = function (txt) {

    for (var prop in loggers) {
      if (loggers.hasOwnProperty(prop)) {
        loggers[prop].log(txt);
      }
    }
    originallog.apply(console, arguments);
  };

})();

module.exports.create = function (path) {
  var logger = loggers[path];
  if (logger) {
    return logger;
  } else {
    logger = new Logger(path);
    loggers[path] = logger;
    return logger;
  }
};
