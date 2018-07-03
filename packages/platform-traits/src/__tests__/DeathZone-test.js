const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const DeathZone = require('../DeathZone');

describe('DeathZone', () => {
  let deathZone, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      deathZone = new DeathZone();
    });

    it('has name', () => {
      expect(deathZone.NAME).to.be('deathZone');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(deathZone);
      });

      it('exposes trait as "deathZone"', () => {
        expect(host.deathZone).to.be(deathZone);
      });
    });
  });
});
