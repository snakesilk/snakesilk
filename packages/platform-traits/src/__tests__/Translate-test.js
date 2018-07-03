const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const Translate = require('../Translate');

describe('Translate', function() {
  let translate, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      translate = new Translate();
    });

    it('has name', () => {
      expect(translate.NAME).to.be('translate');
    });

    it('has a velocity', function() {
      expect(translate.velocity.x).to.be.a('number');
      expect(translate.velocity.y).to.be.a('number');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(translate);
      });

      it('exposes trait as "translate"', () => {
        expect(host.translate).to.be(translate);
      });

      it('moves host when time updated', function() {
          host.translate.velocity.set(5, 5);
          host.timeShift(.5);
          expect(host.position).to.eql({x: 2.5, y: 2.5, z: 0});
      });

      it('honors velocity', function() {
        host.translate.velocity.set(10, 5);
        host.timeShift(1);
        expect(host.position).to.eql({x: 10, y: 5, z: 0});
        host.translate.velocity.set(-10, 5);
        host.timeShift(2);
        expect(host.position).to.eql({x: -10, y: 15, z: 0});
      });
    });
  });
});
