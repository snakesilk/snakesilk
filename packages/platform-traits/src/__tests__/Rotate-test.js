const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const Rotate = require('../Rotate');

describe('Rotate', () => {
  let rotate, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      rotate = new Rotate();
    });

    it('has name', () => {
      expect(rotate.NAME).to.be('rotate');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(rotate);
      });

      it('exposes trait as "rotate"', () => {
        expect(host.rotate).to.be(rotate);
      });
    });
  });
});
