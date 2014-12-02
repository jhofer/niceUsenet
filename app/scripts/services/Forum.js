'use strict';

angular.module('niceUsenetApp')
  .factory('Forum', function ($resource) {
    return $resource('/api/forums/', {

    }, {
      createOrUpdate: {
        method: 'PUT'
      },
      query:  {method:'GET', isArray:true}
	  });
  });
