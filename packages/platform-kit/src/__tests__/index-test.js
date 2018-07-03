const expect = require('expect.js');
const sinon = require('sinon');
const packageJSON = require('../../package.json');
const Main = require('../index.js');

describe('Main Export', function() {
  it('is defined in package.json', () => {
    expect(packageJSON.main).to.be('./dist/index.js');
  });

  describe('Exports', () => {
    it('contains trait registry', () => {
      expect(Main.Traits).to.be(require('../traits'));
    });
  });
});
