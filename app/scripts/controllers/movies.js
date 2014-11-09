'use strict';

angular.module('niceUsenetApp')
  .controller('MoviesCtrl', function ($scope, $http, Movie) {



    $scope.movies = Movie.query();
    $scope.download = function (movie) {
      Movie.download({'id':movie._id}, function() {
        movie.downloaded = true;

      });
    };

  });
