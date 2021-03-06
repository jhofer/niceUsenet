'use strict';

angular.module('niceUsenetApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, Forum, $filter) {
    $scope.errors = {};

    //change password
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

    //forums
    $scope.isCreate = false;
    $scope.forums = Forum.query();
    $scope.newForum = function () {
      $scope.isCreate = true;
      $scope.forum = new Forum({
        forumUrl: 'http://www.usenetrevolution.info/vb/forumdisplay.php?f=???????'
      });

    };



    $scope.editForum = function (forum) {
      $scope.isCreate = false;
      $scope.forum = new Forum();
      $scope.forum.title = forum.title;
      $scope.forum.forumUrl = forum.forumUrl;
      $scope.forum._id = forum._id;
    };

    $scope.cancel = function () {
      $scope.forum = undefined;
      $scope.isCreate = false;
    };

    $scope.createOrUpdateForum = function () {
      if ($scope.forum) {
        if ($scope.forum._id) {
          console.log($scope.forum);
          $scope.forum.$update(function (updatedForum) {
            console.log('updated');
            console.log(updatedForum);
            var oldForum = $filter('filter')($scope.forums, {_id: $scope.forum._id})[0];
            var index = $scope.forums.indexOf(oldForum);
            $scope.forums[index] = updatedForum;
            $scope.cancel();

          });
        } else {
          $scope.forum.$save(function (savedForum) {
            $scope.forums.push(savedForum);

            $scope.cancel();
          });
        }

      }


    };


    $scope.isActive = function (forum) {
      return $scope.forum !== undefined && forum._id == $scope.forum._id;
    };


    $scope.deleteForum = function (forum) {
      forum.$delete(function () {
        var index = $scope.forums.indexOf(forum);
        $scope.forums.splice(index, 1);
        $scope.cancel();
      });

    };


    //tags
    $scope.jsTagOptions = {
      texts: {
        inputPlaceHolder: 'Type new Filters here'
      },
      defaultTags: ['Default Tag #1', 'Default Tag #2']
    };


  });
