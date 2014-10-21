'use strict';

angular.module('niceUsenetApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
