'use strict';

angular.module('niceUsenetApp')
  .controller('MoviesCtrl', function ($scope, $http, Movie) {


    $scope.movies = Movie.query();

    $scope.download = function (id) {
      console.log(id);
      Movie.download({'id':id});
    };

  });
