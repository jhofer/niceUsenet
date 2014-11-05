'use strict';

angular.module('niceUsenetApp')
  .factory('Movie', function ($resource) {
    return $resource('/api/movies/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
