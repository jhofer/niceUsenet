'use strict';

angular.module('niceUsenetApp')
  .controller('MoviesCtrl', function ($scope, $http, Movie) {




    $scope.movies = Movie.query();


    $scope.canDownload = function(movie){
      return movie.status === 'download';
    };



    $scope.download = function (movie) {
      movie.downloaded = true;
      //movie.status = 'requested';
      Movie.download({'id':movie._id}, function() {
        Movie.get({'id':movie._id}, function(newMovie) {
          movie.status = newMovie.status;
        });

      });
    };

  });
