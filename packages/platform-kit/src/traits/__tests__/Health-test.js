const expect = require('expect.js');

const {createNode} = require('@snakesilk/testing/xml');
const {Parser} = require('@snakesilk/xml-loader');
const {Health} = require('@snakesilk/platform-traits');

const factory = require('..')['health'];

describe('Health factory', function() {
  let parser, trait;

  beforeEach(() => {
    parser = new Parser.TraitParser();
  });

  it('creates a Health trait', () => {
    const node = createNode(`<trait/>`);
    trait  = factory(parser, node)();
    expect(trait).to.be.a(Health);
  });

  describe('when no properties defined', () => {
    beforeEach(() => {
      const node = createNode(`<trait/>`);
      trait = factory(parser, node)();
    });

    it('max health is 100', () => {
      expect(trait.energy.max).to.be(100);
    });
  });

  describe('when "max" is given', () => {
    beforeEach(() => {
      const node = createNode(`<trait max="63"/>`);
      trait = factory(parser, node)();
    });

    it('max health is set', () => {
      expect(trait.energy.max).to.be(63);
    });
  });
});
