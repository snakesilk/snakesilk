const expect = require('expect.js');
const sinon = require('sinon');

const {Entity} = require('@snakesilk/engine');
const Environment = require('../Environment');

describe('Environment', () => {
  let environment, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      environment = new Environment();
    });

    it('has name', () => {
      expect(environment.NAME).to.be('environment');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(environment);
      });

      it('exposes trait as "environment"', () => {
        expect(host.environment).to.be(environment);
      });
    });
  });
});
