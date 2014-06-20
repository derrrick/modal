'use strict';
describe('Directive: gravatarSrc', function() {
  var element;
  beforeEach(module('ui.gravatar'));
  element = {};
  it('should set the src attribute with Gravatar URL', inject(function($rootScope, $compile) {
    $rootScope.email = "test@example.com";
    element = angular.element('<img gravatar-src="email">');
    element = $compile(element)($rootScope);
    $rootScope.$apply();
    return expect(element.attr('src')).toBeTruthy();
  }));
  return it('should set the src attribute from static src', inject(function($rootScope, $compile) {
    element = angular.element('<img gravatar-src="\'sebastian.wallin@gmail.com\'">');
    element = $compile(element)($rootScope);
    $rootScope.$apply();
    return expect(element.attr('src')).toBeTruthy();
  }));
});

describe('Service: gravatarService', function() {
  var email, emailmd5, gravatarService;
  beforeEach(module('ui.gravatar'));
  gravatarService = {};
  beforeEach(inject(function(_gravatarService_) {
    return gravatarService = _gravatarService_;
  }));
  email = 'sebastian.wallin@gmail.com';
  emailmd5 = '46ab5c60ced85b09c35fd31a510206ef';
  return describe('#url:', function() {
    it('should generate an url without parameters to gravatar avatar endpoint', function() {
      var url;
      url = gravatarService.url(email);
      return expect(url).toBe('http://www.gravatar.com/avatar/' + emailmd5);
    });
    it('should generate an url with provided parameters', function() {
      var k, opts, url, v, _results;
      opts = {
        size: 100,
        "default": 'mm'
      };
      url = gravatarService.url(email, opts);
      _results = [];
      for (k in opts) {
        v = opts[k];
        _results.push(expect(url).toContain("" + k + "=" + v));
      }
      return _results;
    });
    it('should URL encode options in final URL', function() {
      var opts, url, urlEscaped;
      url = 'http://placekitten.com/100/100';
      urlEscaped = escape('http://placekitten.com/100/100');
      opts = {
        "default": url
      };
      return expect(gravatarService.url(email, opts)).toMatch(urlEscaped);
    });
    it('should not re-encode the source if it is already a lowercase MD5 hash', function() {
      return expect(gravatarService.url(emailmd5)).toMatch(emailmd5);
    });
    it('should not re-encode the source if it is already an uppercase MD5 hash', function() {
      var src;
      src = emailmd5.toUpperCase();
      return expect(gravatarService.url(src)).toMatch(src);
    });
    return it('should not overwrite default options', function() {
      var opts, url;
      opts = {
        size: 100
      };
      url = gravatarService.url(email, opts);
      url = gravatarService.url(email);
      return expect(url).not.toContain('size');
    });
  });
});
