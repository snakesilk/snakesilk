const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const Health = require('../Health');
const Invincibility = require('../Invincibility');

describe('Invincibility', () => {
  let invincibility, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      invincibility = new Invincibility();
    });

    it('has name', () => {
      expect(invincibility.NAME).to.be('invincibility');
    });

    describe('when applied without Health already applied', () => {
      it('throw an expection', () => {
        expect(() => {
          const host = new Entity();
          host.applyTrait(invincibility);
        }).to.throwError(error => {
          expect(error).to.be.an(Error);
          expect(error.message).to.be('Required trait "health" not found');
        });
      });
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(new Health());
        host.applyTrait(invincibility);
      });

      it('exposes trait as "invincibility"', () => {
        expect(host.invincibility).to.be(invincibility);
      });
    });
  });
});
