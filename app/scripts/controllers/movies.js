'use strict';

angular.module('niceUsenetApp')
  .controller('MoviesCtrl', function ($scope, $http, Movie, sabnzbd) {



    $scope.movies = Movie.query();
    console.log(sabnzbd());
    $scope.download = function (movie) {
      Movie.download({'id':movie._id}, function() {
        movie.downloaded = true;

      });
    };

  });
