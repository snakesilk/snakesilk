const expect = require('expect.js');

const {createNode} = require('@snakesilk/testing/xml');
const {Parser} = require('@snakesilk/xml-loader');
const {FixedForce} = require('@snakesilk/platform-traits');

const factory = require('..')['fixed-force'];

describe('FixedForce factory', function() {
  let parser;

  beforeEach(() => {
    parser = new Parser.TraitParser();
  });

  it('creates a FixedForce trait', () => {
    const node = createNode(`<trait/>`);
    trait = factory(parser, node)();
    expect(trait).to.be.a(FixedForce);
  });

  describe('when no properties defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait/>`);
      trait = factory(parser, node)();
    });

    it('has force 0,0', () => {
      expect(trait.force.x).to.be(0);
      expect(trait.force.y).to.be(0);
    });
  });

  describe('when X defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait x="123.244"/>`);
      trait = factory(parser, node)();
    });

    it('x is set', () => {
      expect(trait.force.x).to.be(123.244);
    });

    it('y is default 0', () => {
      expect(trait.force.y).to.be(0);
    });
  });

  describe('when Y defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait y="512.561"/>`);
      trait = factory(parser, node)();
    });

    it('y is set', () => {
      expect(trait.force.y).to.be(512.561);
    });

    it('x is default 0', () => {
      expect(trait.force.x).to.be(0);
    });
  });

  describe('when X and Y', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait x="843.24" y="1.561"/>`);
      trait = factory(parser, node)();
    });

    it('x is set', () => {
      expect(trait.force.x).to.be(843.24);
    });

    it('y is set', () => {
      expect(trait.force.y).to.be(1.561);
    });
  });
});
