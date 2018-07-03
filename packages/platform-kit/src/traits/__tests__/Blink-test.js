const expect = require('expect.js');

const {createNode} = require('@snakesilk/testing/xml');
const {Parser} = require('@snakesilk/xml-loader');
const {Blink} = require('@snakesilk/platform-traits');

const factory = require('..')['blink'];

describe('Blink factory', function() {
  let parser, trait;

  beforeEach(() => {
    parser = new Parser.TraitParser();
  });

  it('creates a Health trait', () => {
    const node = createNode(`<trait/>`);
    trait  = factory(parser, node)();
    expect(trait).to.be.a(Blink);
  });

  describe('when no properties defined', () => {
    beforeEach(() => {
      const node = createNode(`<trait/>`);
      trait = factory(parser, node)();
    });

    it('interval is 1', () => {
      expect(trait.interval).to.be(1);
    });

    it('ratio 0.5', () => {
      expect(trait.ratio).to.be(0.5);
    });
  });

  describe('when "interval" is given', () => {
    beforeEach(() => {
      const node = createNode(`<trait interval="12.34"/>`);
      trait = factory(parser, node)();
    });

    it('interval is honored', () => {
      expect(trait.interval).to.be(12.34);
    });
  });

  describe('when "ratio" is given', () => {
    beforeEach(() => {
      const node = createNode(`<trait ratio="0.12"/>`);
      trait = factory(parser, node)();
    });

    it('ratio is honored', () => {
      expect(trait.ratio).to.be(0.12);
    });
  });
});
