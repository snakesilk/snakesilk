const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const Disappearing = require('../Disappearing');

describe('Disappearing', () => {
  let disappearing, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      disappearing = new Disappearing();
    });

    it('has name', () => {
      expect(disappearing.NAME).to.be('disappearing');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(disappearing);
      });

      it('exposes trait as "disappearing"', () => {
        expect(host.disappearing).to.be(disappearing);
      });
    });
  });
});
