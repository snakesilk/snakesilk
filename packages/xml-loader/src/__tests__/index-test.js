const expect = require('expect.js');
const sinon = require('sinon');
const packageJSON = require('../../package.json');
const Main = require('../index.js');

describe('Main Export', function() {
  it('is defined in package.json', () => {
    expect(packageJSON.main).to.be('./dist/index.js');
  });

  describe('Exports', () => {
    it('exports XMLLoader', () => {
      expect(Main.XMLLoader).to.be(require('../XMLLoader'));
    });

    it('exports Parser', () => {
      expect(Main.Parser).to.be(require('../parsers/Parser'));
    });

    it('exports Util', () => {
      expect(Main.Util).to.be(require('../util/traverse'));
    });

    it('exports EntityParser', () => {
      expect(Main.Parser.EntityParser).to.be(require('../parsers/EntityParser'));
    });

    it('exports SceneParser', () => {
      expect(Main.Parser.SceneParser).to.be(require('../parsers/SceneParser'));
    });

    it('exports TraitParser', () => {
      expect(Main.Parser.TraitParser).to.be(require('../parsers/TraitParser'));
    });
  });
});
