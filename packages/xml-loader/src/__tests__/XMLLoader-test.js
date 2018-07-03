const expect = require('expect.js');
const sinon = require('sinon');
const XMLLoader = require('../XMLLoader');

describe('XMLLoader', () => {
    describe('on instantiation', () => {
        let xmlLoader;

        beforeEach(() => {
            xmlLoader = new XMLLoader();
        });

        it('has no method loadScene()', () => {
            expect(xmlLoader.loadScene).to.be(undefined);
        });

        it('has no method parseScene()', () => {
            expect(xmlLoader.loadScene).to.be(undefined);
        });
    });
});
