'use strict';

angular.module('niceUsenetApp')
  .controller('ServerlogCtrl', function ($scope, $http, $sce) {
    $scope.isLoading = true;


    $scope.load = function () {

      $http.get('/api/serverlog').success(function (serverlog) {
        $scope.serverlog = $sce.trustAsHtml(serverlog);
        $scope.isLoading = false;
      });
    };
    $scope.load();


  });
