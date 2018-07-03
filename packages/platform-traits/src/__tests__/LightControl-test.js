const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const LightControl = require('../LightControl');

describe('LightControl', () => {
  let lightControl, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      lightControl = new LightControl();
    });

    it('has name', () => {
      expect(lightControl.NAME).to.be('lightcontrol');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(lightControl);
      });

      it('exposes trait as "lightControl"', () => {
        expect(host.lightcontrol).to.be(lightControl);
      });
    });
  });
});
