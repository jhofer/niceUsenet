'use strict';


console.log('define stack');


angular.module('niceUsenetApp').directive('moviestack', function (Movie) {
  return {
    restrict: 'E',
    scope: {
      movies: '=movies'
    },
    templateUrl: './partials/movieStackTemplate.html',

    link: function (scope) {


      scope.selectedMovie = scope.movies[0];
      scope.canDownload = function (movie) {

        return movie.status === 'download';
      };

      scope.hasImdb = function (movie) {
        var result = false;
        if (typeof movie.rating !== 'undefined') {
          result = true;
        }

        return result;

      };

      scope.download = function (movie) {
        movie.downloaded = true;
        movie.status = 'requested';
        Movie.download({'id': movie._id}, function () {
          Movie.get({'id': movie._id}, function (newMovie) {
            movie.status = newMovie.status;
          });

        });
      };

      scope.selectMovie = function (movie) {
        scope.selectedMovie = movie;
      };

      scope.getFormatedDate = function (date) {
        return date.split('T')[0];
      };
    }
  };
});
