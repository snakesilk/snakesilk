const expect = require('expect.js');

const {createNode} = require('@snakesilk/testing/xml');
const {Parser} = require('@snakesilk/xml-loader');
const {Pickupable} = require('@snakesilk/platform-traits');

const factory = require('..')['pickupable'];

describe('Pickupable factory', function() {
  let parser;

  beforeEach(() => {
    parser = new Parser.TraitParser();
  });

  it('creates a Pickupable trait', () => {
    const node = createNode(`<trait/>`);
    trait = factory(parser, node)();
    expect(trait).to.be.a(Pickupable);
  });

  describe('when no properties defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait/>`);
      trait = factory(parser, node)();
    });

    it('has no properties', () => {
      expect(trait.properties).to.eql({});
    });
  });

  describe('when properties defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait>
        <property type="flower"/>
        <property kind="rollover"/>
      </trait>`);
      trait = factory(parser, node)();
    });

    it('has properties set', () => {
      expect(trait.properties).to.eql({
        type: 'flower',
        kind: 'rollover',
      });
    });
  });
});
