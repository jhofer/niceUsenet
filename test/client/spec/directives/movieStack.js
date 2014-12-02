'use strict';

describe('Directive: moviestack', function () {

  // load the controller's module
  beforeEach(module('niceUsenetApp'));


  beforeEach(module('partials/movieStackTemplate.html'));

  var
    rootScope,
    element,
    compile;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $compile) {

    compile = $compile;

    rootScope = $rootScope;
    rootScope.movies = [
      {
        title: 'awesome movie',
        threadUrl: 'url',
        forumUrl: '31',
        createdAt: '2014-11-17T21:47:05.461Z',
        status: 'download'
      },
      {
        title: 'awesome movie 2014',
        threadUrl: 'url',
        forumUrl: '31',
        createdAt: '2014-11-20T21:47:05.461Z',
        status: 'download'
      }
    ];

    // Compile a piece of HTML containing the directive
    element = compile('<moviestack movies="movies" ></moviestack>')(rootScope);
    // fire all the watches
    rootScope.$digest();


  }));

  it('Replaces the element with the appropriate content', function () {
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain('awesome movie');
    expect(element.html()).toContain('2014-11-17');
    expect(element.html()).toContain('2014-11-20');

  });


  it('should have 2 movies', function () {
    expect(element.scope().movies.length).toBe(2);
    expect(element.scope().movies[0].title).toBe('awesome movie');
    expect(element.scope().movies[1].title).toBe('awesome movie 2014');

  });


});
