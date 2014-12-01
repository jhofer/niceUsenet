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
          forumUrl: '31',
          createdAt: '2014-11-17T21:47:05.461Z'
        },
        {
          title: 'awesome movie 2014',
          threadUrl: 'url',
          forumUrl: '31',
          createdAt: '2014-11-20T21:47:05.461Z'
        },
        {
          title: 'crap 2014',
          threadUrl: 'url',
          forumUrl: '31',
          createdAt: '2014-11-17T21:30:05.461Z'
        }
      ]);
    scope = $rootScope.$new();
    MoviesCtrl = $controller('MoviesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of Movies to the scope', function () {
    expect(scope.movieContainer.length).toBe(0);
    $httpBackend.flush();
    expect(Object.keys(scope.movieContainer).length).toBe(2);
  });


  it('should group Movies bye name', function () {
    $httpBackend.flush();
    expect(scope.movieContainer.length).toBe(2);
    console.log(scope.movieContainer);
    expect(scope.movieContainer[0][0].title).toBe('awesome movie 2014');
    expect(scope.movieContainer[0][1].title).toBe('awesome movie');
    expect(scope.movieContainer[1][0].title).toBe('crap 2014');
  });


});
