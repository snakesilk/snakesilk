const expect = require('expect.js');
const sinon = require('sinon');

const {createNode} = require('@snakesilk/testing/xml');
const {Parser} = require('@snakesilk/xml-loader');
const {Projectile} = require('@snakesilk/platform-traits');

const factory = require('..')['projectile'];

describe('Projectile factory', function() {
  let parser, trait;

  beforeEach(() => {
    parser = new Parser.TraitParser();
    sinon.stub(Projectile.prototype, 'setDamage');
    sinon.stub(Projectile.prototype, 'setRange');
    sinon.stub(Projectile.prototype, 'setSpeed');
  });

  afterEach(() => {
    Projectile.prototype.setDamage.restore();
    Projectile.prototype.setRange.restore();
    Projectile.prototype.setSpeed.restore();
  });

  it('creates a Projectile trait', () => {
    const node = createNode(`<trait/>`);
    trait = factory(parser, node)();
    expect(trait).to.be.a(Projectile);
  });

  describe('when no properties defined', () => {
    beforeEach(() => {
      const node = createNode(`<trait/>`);
      trait = factory(parser, node)();
    });

    it('creates a valid trait', () => {
      expect(trait).to.be.a(Projectile);
    });

    it('sets damage to 1', () => {
      expect(trait.setDamage.lastCall.args[0]).to.equal(1);
    });

    it('sets range to 100', () => {
      expect(trait.setRange.lastCall.args[0]).to.equal(100);
    });

    it('sets speed to 100', () => {
      expect(trait.setSpeed.lastCall.args[0]).to.equal(100);
    });

    it('sets penetratingForce to false', () => {
      expect(trait.penetratingForce).to.be(false);
    });
  });

  describe('when damage defined', () => {
    beforeEach(() => {
      const node = createNode(`<trait damage="8.5"/>`);
      trait = factory(parser, node)();
    });

    it('sets damage', () => {
      expect(trait.setDamage.lastCall.args[0]).to.equal(8.5);
    });
  });

  describe('when range defined', () => {
    beforeEach(() => {
      const node = createNode(`<trait range="1523.124"/>`);
      trait = factory(parser, node)();
    });

    it('sets range', () => {
      expect(trait.setRange.lastCall.args[0]).to.equal(1523.124);
    });
  });

  describe('when speed defined', () => {
    beforeEach(() => {
      const node = createNode(`<trait speed="762.12"/>`);
      trait = factory(parser, node)();
    });

    it('sets speed', () => {
      expect(trait.setSpeed.lastCall.args[0]).to.equal(762.12);
    });
  });

  [true, false].forEach(bool => {
    describe(`when penetrates set to ${bool}`, () => {
      beforeEach(() => {
        const node = createNode(`<trait penetrates="${bool}"/>`);
        trait = factory(parser, node)();
      });

      it(`penetratingForce is set to ${bool}`, () => {
        expect(trait.penetratingForce).to.be(bool);
      });
    });
  })
});
