'use strict';

angular.module('niceUsenetApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, Forum, $filter) {
    $scope.errors = {};


    $scope.changePassword = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
          .then(function () {
            $scope.message = 'Password successfully changed.';
          })
          .catch(function () {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
          });
      }
    };

    $scope.forums = Forum.query();




    function findForumByUrl(url) {
      var forum = null;
      $scope.forums.forEach(function (f) {
        if (f.forumUrl === url) {
          forum = f;
        }
      });
      return forum;
    }

    $scope.editForum = function (forum) {
      $scope.forum.title = forum.title;
      $scope.forum.forumUrl = forum.forumUrl;
    };

    $scope.createOrUpdateForum = function (form) {
      if (form.$valid) {
        Forum.createOrUpdate({}, $scope.forum, function (result) {
          var oldForum = $filter('filter')($scope.forums, {_id: result._id})[0];

          if (oldForum) {
            var index = $scope.forums.indexOf(oldForum);
            console.log(index);
            console.log(result);
            $scope.forums[index] = result;
          } else {
            $scope.forums.push(result);
          }
        });
        $scope.newForum();
      }

    };


    $scope.newForum = function () {
      $scope.forum = {
        forumUrl: 'http://www.usenetrevolution.info/vb/forumdisplay.php?f=???????'
      };
    };

    $scope.newForum();

    $scope.urlReadOnly = function () {
      return findForumByUrl($scope.forum.forumUrl) !== null;
    };


    $scope.deleteForum = function (forum) {
      Forum.remove({id: forum._id}, function () {

        var index = $scope.forums.indexOf(forum);
        $scope.forums.splice(index, 1);


      });
    };


  });
