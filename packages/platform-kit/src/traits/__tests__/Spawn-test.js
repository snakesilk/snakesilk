const expect = require('expect.js');
const sinon = require('sinon');

const {createNode} = require('@snakesilk/testing/xml');
const {Entity, Loader, World} = require('@snakesilk/engine');
const {Parser} = require('@snakesilk/xml-loader');
const {Spawn} = require('@snakesilk/platform-traits');

const factory = require('..')['spawn'];

describe('Spawn factory', function() {
  const MockEntity1 = Symbol('mock entity 1');
  const MockEntity2 = Symbol('mock entity 2');

  let parser, trait;

  beforeEach(() => {
    parser = new Parser.TraitParser(new Loader());
    sinon.stub(Spawn.prototype, 'addItem');
  });

  afterEach(() => {
    Spawn.prototype.addItem.restore();
  });

  it('creates a Spawn trait', () => {
    const node = createNode(`<trait/>`);
    return factory(parser, node)
    .then(createTrait => {
      const trait = createTrait();
      expect(trait).to.be.a(Spawn);
    });
  });

  describe('when parsing using undefined object', () => {
    // Async ResourceManager does not emit errors.
    it.skip('raises an exception', () => {
      const node = createNode(`<trait name="spawn">
        <entity event="recycle" id="UndefinedObject"/>
      </trait>`);
      return factory(parser, node)
      .catch(error => {
        expect(error).to.be.a(Error);
        expect(error.message).to.be('No resource "UndefinedObject" of type entity.');
      });
    });
  });

  describe('when parsing with single item defined', () => {
    beforeEach(() => {
      parser.loader.resourceManager.addEntity('Explosion', MockEntity1);
      const node = createNode(`<trait>
          <entity event="recycle" id="Explosion"/>
      </trait>`);

      return factory(parser, node)
      .then(createTrait => {
        trait = createTrait();
      });
    });

    it('discovers a single item', () => {
      expect(trait.addItem.callCount).to.be(1);
      expect(trait.addItem.lastCall.args).to.eql([
        'recycle',
        MockEntity1,
        undefined,
      ]);
    });
  });

  describe('when parsing with multiple items', () => {
    beforeEach(() => {
      parser.loader.resourceManager.addEntity('Explosion', MockEntity1);
      parser.loader.resourceManager.addEntity('Blast', MockEntity2);
      const node = createNode(`<trait name="spawn">
          <entity event="recycle" id="Explosion"/>
          <entity event="blast" id="Blast">
              <offset x="13.2341" y="11.123" z="-5.412"/>
          </entity>
      </trait>`);
      return factory(parser, node)
      .then(createTrait => {
        trait = createTrait();
      });
    });

    it('discovers multiple items', () => {
      expect(trait.addItem.callCount).to.be(2);
    });

    it('parses event names', () => {
      expect(trait.addItem.getCall(0).args[0]).to.equal('recycle');
      expect(trait.addItem.getCall(1).args[0]).to.equal('blast');
    });

    it('resolves correct object', () => {
      expect(trait.addItem.getCall(0).args[1]).to.be(MockEntity1);
      expect(trait.addItem.getCall(1).args[1]).to.be(MockEntity2);
    });

    it('parses offset when given', () => {
      expect(trait.addItem.getCall(1).args[2]).to.eql({
        x: 13.2341,
        y: 11.123,
        z: -5.412,
      });
    });
  });
});
