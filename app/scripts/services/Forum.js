'use strict';

angular.module('niceUsenetApp')
  .factory('Forum', function ($resource) {
    return $resource('/api/forums/:id', {
      id: '@id'
    }, {
      createOrUpdate: {
        method: 'PUT'
      },
      query:  {method:'GET', isArray:true}
	  });
  });
