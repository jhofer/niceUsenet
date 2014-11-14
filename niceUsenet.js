var forever = require('forever-monitor');

var server = new (forever.Monitor)('server.js', {
  'silent': false
});
server.start();

var scrawler = new (forever.Monitor)('scrawler.js', {
  'silent': false
});
scrawler.start();


var downloader = new (forever.Monitor)('downloader.js', {
  'silent': false
});
downloader.start();
