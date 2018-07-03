const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const FixedForce = require('../FixedForce');

describe('FixedForce', () => {
  let fixedForce, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      fixedForce = new FixedForce();
    });

    it('has name', () => {
      expect(fixedForce.NAME).to.be('fixedForce');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(fixedForce);
      });

      it('exposes trait as "fixedForce"', () => {
        expect(host.fixedForce).to.be(fixedForce);
      });
    });
  });
});
