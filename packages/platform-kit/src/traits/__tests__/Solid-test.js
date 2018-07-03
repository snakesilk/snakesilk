const expect = require('expect.js');

const {createNode} = require('@snakesilk/testing/xml');
const {Parser} = require('@snakesilk/xml-loader');
const {Solid} = require('@snakesilk/platform-traits');

const factory = require('..')['solid'];

describe('Solid factory', function() {
  let parser;

  beforeEach(() => {
    parser = new Parser.TraitParser();
  });

  it('creates a Solid trait', () => {
    const node = createNode(`<trait/>`);
    trait = factory(parser, node)();
    expect(trait).to.be.a(Solid);
  });

  describe('when no properties defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait/>`);
      trait = factory(parser, node)();
    });

    it('fixed is false', () => {
      expect(trait.fixed).to.be(false);
    });

    it('obstructs is false', () => {
      expect(trait.obstructs).to.be(false);
    });

    it('attackAccept is all', () => {
      expect(trait.attackAccept).to.eql([
        Solid.SIDES.TOP,
        Solid.SIDES.BOTTOM,
        Solid.SIDES.LEFT,
        Solid.SIDES.RIGHT,
      ]);
    });
  });

  [true, false].forEach(bool => {
    describe(`when "fixed" set to ${bool}`, () => {
      let trait;

      beforeEach(() => {
        const node = createNode(`<trait fixed="${bool}"/>`);
        trait = factory(parser, node)();
      });

      it('fixed is false', () => {
        expect(trait.fixed).to.be(bool);
      });
    });

    describe(`when "obstructs" set to ${bool}`, () => {
      let trait;

      beforeEach(() => {
        const node = createNode(`<trait obstructs="${bool}"/>`);
        trait = factory(parser, node)();
      });

      it('obstructs is false', () => {
        expect(trait.obstructs).to.be(bool);
      });
    });
  });

  describe('when attack accept set to "top bottom"', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait attack="top bottom"/>`);
      trait = factory(parser, node)();
    });

    it('attackAccept has two entries', () => {
      expect(trait.attackAccept).to.have.length(2);
    });

    it('attackAccept contains top', () => {
      expect(trait.attackAccept).to.contain(Solid.SIDES.TOP);
    });

    it('attackAccept contains bottom', () => {
      expect(trait.attackAccept).to.contain(Solid.SIDES.BOTTOM);
    });
  });

  describe('when attack accept set to "left"', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait attack="left"/>`);
      trait = factory(parser, node)();
    });

    it('attackAccept contains left only', () => {
      expect(trait.attackAccept).to.eql([Solid.SIDES.LEFT]);
    });
  });

  describe('when attack accept set to "top left right bottom"', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait attack="top left right bottom"/>`);
      trait = factory(parser, node)();
    });

    it('attackAccept contains left', () => {
      expect(trait.attackAccept).to.eql([
        Solid.SIDES.TOP,
        Solid.SIDES.LEFT,
        Solid.SIDES.RIGHT,
        Solid.SIDES.BOTTOM,
      ]);
    });
  });
});
