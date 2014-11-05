'use strict';

angular.module('niceUsenetApp')
  .controller('MoviesCtrl', function ($scope, $http) {
    $http.get('/api/movies').success(function(movies) {
      $scope.movies = movies;
    });

    $scope.download = function(id){
      $http.post('/api/movies').success(function(hdmovies) {
        $scope.movies = hdmovies;
      });
    }


  });
