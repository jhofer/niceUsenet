'use strict';

angular.module('niceUsenetApp')
  .controller('MoviesCtrl', function ($scope, Movie) {



    $scope.movieMap = {};
    var movies = Movie.query();

    movies.$promise.then(function(data){

      angular.forEach(data, function (movie) {
        var strings = movie.title.split(' ');
        var key = strings[0]+' '+strings[1];

        if($scope.movieMap[key]){
          $scope.movieMap[key].push(movie);
        }else{
          $scope.movieMap[key] = [];
          $scope.movieMap[key].push(movie);
        }

      });


    });

  });

angular.module('niceUsenetApp').filter('movieFilter', function($filter) {

  return function(movieMap, searchText) {
    var result = [];
    for (var property in movieMap) {
      if (movieMap.hasOwnProperty(property)) {
        var movies = movieMap[property];
        var filtered = $filter('filter')(movies, searchText);
        if(filtered.length >0){
          result.push(movies);
        }
      }
    }
    return result;
  };
});
