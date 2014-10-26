'use strict';

angular.module('niceUsenetApp')
  .controller('HdmoviesCtrl', function ($scope, $http) {
    $http.get('/api/hdmovies').success(function(hdmovies) {
      $scope.hdmovies = hdmovies;
    });
  });
