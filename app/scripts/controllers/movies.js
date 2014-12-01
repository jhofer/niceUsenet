'use strict';

angular.module('niceUsenetApp')
  .controller('MoviesCtrl', function ($scope, Movie) {

    function sortByDate(movieA, movieB) {
      var a = movieA.createdAt;
      var b = movieB.createdAt;
      return new Date(b) - new Date(a);
    }


    $scope.movieContainer = [];
    var movies = Movie.query();

    movies.$promise.then(function (data) {
      var movieMap = {};
      angular.forEach(data, function (movie) {
        var strings = movie.title.split(' ');
        var key = strings[0] + ' ' + strings[1];

        if (movieMap[key]) {
          movieMap[key].push(movie);
        } else {
          movieMap[key] = [];
          movieMap[key].push(movie);
        }

      });

      //fill map to array
      for (var property in movieMap) {
        if (movieMap.hasOwnProperty(property)) {
          var movies = movieMap[property];
          movies.sort(sortByDate);
          $scope.movieContainer.push(movies);
        }
      }

      $scope.movieContainer.sort(function (movieA, movieB) {
        var a = movieA[0].createdAt;
        var b = movieB[0].createdAt;
        return new Date(b) - new Date(a);
      });


    });

  });




angular.module('niceUsenetApp').filter('movieFilter', function ($filter) {

  return function (movieMap, searchText) {
    var result = [];
    for (var property in movieMap) {
      if (movieMap.hasOwnProperty(property)) {
        var movies = movieMap[property];
        var filtered = $filter('filter')(movies, searchText);
        if (filtered.length > 0) {
          result.push(movies);
        }
      }
    }
    return result;
  };
});
