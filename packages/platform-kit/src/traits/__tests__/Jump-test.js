const expect = require('expect.js');

const {createNode} = require('@snakesilk/testing/xml');
const {Parser} = require('@snakesilk/xml-loader');
const {Jump} = require('@snakesilk/platform-traits');

const factory = require('..')['jump'];

describe('Jump factory', function() {
  let parser;

  beforeEach(() => {
    parser = new Parser.TraitParser();
  });

  it('creates a Jump trait', () => {
    const node = createNode(`<trait/>`);
    trait = factory(parser, node)();
    expect(trait).to.be.a(Jump);
  });

  describe('when no properties defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait/>`);
      trait = factory(parser, node)();
    });

    it('X force is 0', () => {
      expect(trait.force.x).to.be(0);
    });

    it('Y force is 500', () => {
      expect(trait.force.y).to.be(500);
    });

    it('duration is 0.19', () => {
      expect(trait.duration).to.be(0.18);
    });
  });

  describe('when duration given', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait duration="2.13"/>`);
      trait = factory(parser, node)();
    });

    it('duration is set', () => {
      expect(trait.duration).to.be(2.13);
    });
  });

  describe('when "force" specified', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait force="1023.124"/>`);
      trait = factory(parser, node)();
    });

    it('Y force is set', () => {
      expect(trait.force.y).to.be(1023.124);
    });
  });

  describe('when "forward" specified', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait forward="233.124"/>`);
      trait = factory(parser, node)();
    });

    it('X force is set', () => {
      expect(trait.force.x).to.be(233.124);
    });
  });
});
