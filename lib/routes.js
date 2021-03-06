'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    rest = require('./controllers/rest'),
    session = require('./controllers/session');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);
  app.get('/api/serverlog', api.serverlog);

  app.get('/api/movies', api.movies);
  app.get('/api/movies/:id', api.movie);
  app.put('/api/movies/:id', api.download);




  var forums = rest.create('Forum');
  app.get('/api/forums', forums.list);
  app.post('/api/forums', forums.create);
  app.get('/api/forums/:id', forums.get);
  app.put('/api/forums/:id', forums.update);
  app.del('/api/forums/:id', forums.delete);


  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};
