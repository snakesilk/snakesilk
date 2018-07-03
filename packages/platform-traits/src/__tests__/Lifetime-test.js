const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const Lifetime = require('../Lifetime');

describe('Lifetime', () => {
  let lifetime, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      lifetime = new Lifetime();
    });

    it('has name', () => {
      expect(lifetime.NAME).to.be('lifetime');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(lifetime);
      });

      it('exposes trait as "lifetime"', () => {
        expect(host.lifetime).to.be(lifetime);
      });
    });
  });
});
