'use strict';
var helpFuncs = require('./../help-funcs').default;

describe('Help functions:', function () {

  describe('sum', function () {
    it('should calculate right value', function () {
      expect(helpFuncs.sum(15, 2)).toBe(17);
    });
  });

});
