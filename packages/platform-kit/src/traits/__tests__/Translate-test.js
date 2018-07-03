const expect = require('expect.js');

const {createNode} = require('@snakesilk/testing/xml');
const {Parser} = require('@snakesilk/xml-loader');
const {Translate} = require('@snakesilk/platform-traits');

const factory = require('..')['translate'];

describe('Translate factory', function() {
  let parser;

  beforeEach(() => {
    parser = new Parser.TraitParser();
  });

  it('creates a Translate trait', () => {
    const node = createNode(`<trait/>`);
    trait = factory(parser, node)();
    expect(trait).to.be.a(Translate);
  });

  describe('when no properties defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait/>`);
      trait = factory(parser, node)();
    });

    it('has velocity 0,0', () => {
      expect(trait.velocity.x).to.be(0);
      expect(trait.velocity.y).to.be(0);
    });
  });

  describe('when X and Y', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait x="843.24" y="1.561"/>`);
      trait = factory(parser, node)();
    });

    it('x is set', () => {
      expect(trait.velocity.x).to.be(843.24);
    });

    it('y is set', () => {
      expect(trait.velocity.y).to.be(1.561);
    });
  });
});
