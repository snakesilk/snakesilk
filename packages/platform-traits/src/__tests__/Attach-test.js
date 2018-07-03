const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const Attach = require('../Attach');

describe('Attach', () => {
  let attach, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      attach = new Attach();
    });

    it('has name', () => {
      expect(attach.NAME).to.be('attach');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(attach);
      });

      it('exposes trait as "attach"', () => {
        expect(host.attach).to.be(attach);
      });
    });
  });
});
