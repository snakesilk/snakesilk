const expect = require('expect.js');

const {createNode} = require('@snakesilk/testing/xml');
const {Parser} = require('@snakesilk/xml-loader');
const {LightControl} = require('@snakesilk/platform-traits');

const factory = require('..')['light-control'];

describe('LightControl factory', function() {
  let parser;

  beforeEach(() => {
    parser = new Parser.TraitParser();
  });

  it('creates a LightControl trait', () => {
    const node = createNode(`<trait/>`);
    trait = factory(parser, node)();
    expect(trait).to.be.a(LightControl);
  });

  describe('when no properties defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait/>`);
      trait = factory(parser, node)();
    });

    it('color is white', () => {
      expect(trait.color).to.eql({
        r: 1,
        g: 1,
        b: 1,
      });
    });
  });

  describe('when color defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait color=".1,.03,.06"/>`);
      trait = factory(parser, node)();
    });

    it('color is honored', () => {
      expect(trait.color).to.eql({
        r: 0.1,
        g: 0.03,
        b: 0.06,
      });
    });
  });
});
