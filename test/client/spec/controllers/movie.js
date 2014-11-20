'use strict';

describe('Controller: MoviesCtrl', function () {

  // load the controller's module
  beforeEach(module('niceUsenetApp'));

  var MoviesCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/movies')
      .respond([
        {
          title: 'awesome movie',
          threadUrl: 'url',
          forumUrl: '31'
        },
        {
          title: 'awesome movie 2014',
          threadUrl: 'url',
          forumUrl: '31'
        },
        {
          title: 'crap 2014',
          threadUrl: 'url',
          forumUrl: '31'
        }


      ]);
    scope = $rootScope.$new();
    MoviesCtrl = $controller('MoviesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of Movies to the scope', function () {
    expect(Object.keys(scope.movieContainer).length).toBe(0);
    $httpBackend.flush();
    expect(Object.keys(scope.movieContainer).length).toBe(2);
  });
});
