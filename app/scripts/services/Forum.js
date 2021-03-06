'use strict';

angular.module('niceUsenetApp')
  .factory('Forum', function ($resource) {
    return $resource('/api/forums/:id', {
      id: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
	  });
  });
