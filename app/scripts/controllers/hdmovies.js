'use strict';

angular.module('niceUsenetApp')
  .controller('HdmoviesCtrl', function ($scope, $http, User, Auth) {
    $http.get('/api/hdmovies').success(function(hdmovies) {
      $scope.hdmovies = hdmovies;
    });
  });
