const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const Health = require('../Health');

describe('Health', () => {
  let health, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      health = new Health();
    });

    it('has name', () => {
      expect(health.NAME).to.be('health');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(health);
      });

      it('exposes trait as "health"', () => {
        expect(host.health).to.be(health);
      });
    });
  });
});
