const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const Glow = require('../Glow');

describe('Glow', () => {
  let glow, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      glow = new Glow();
    });

    it('has name', () => {
      expect(glow.NAME).to.be('glow');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(glow);
      });

      it('exposes trait as "glow"', () => {
        expect(host.glow).to.be(glow);
      });
    });
  });
});
