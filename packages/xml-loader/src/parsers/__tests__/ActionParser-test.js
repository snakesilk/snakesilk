const expect = require('expect.js');
const sinon = require('sinon');
const {createNode} = require('@snakesilk/testing/xml');

const ActionParser = require('../ActionParser');

describe('ActionParser', () => {
  let parser;

  beforeEach(() => {
    parser = new ActionParser();
  });

  describe('#resolveFunction', () => {
    let node, func;

    describe('play-sequence', () => {
      beforeEach(() => {
        node = createNode('<action type="play-sequence" id="my-sequence"/>');
        func = parser.resolveFunction(node);
      });

      it('returns function', () => {
        expect(func).to.be.a(Function);
      });

      describe('returned function', () => {
        let fakeThis;

        beforeEach(() => {
          fakeThis = {
            sequencer: {
              playSequence: sinon.stub().returns('a string'),
            },
          };
        });

        it('calls `playSequence` on sequencer object of `this`', () => {
          func.call(fakeThis);
          expect(fakeThis.sequencer.playSequence.callCount).to.be(1);
        });

        it('returns undefined', () => {
          /* Avoid returning Promise given from playSequence since
             that would have the next action wait for the sequence to start.
             This would prevent paralellsim of animations.
          */
          expect(func.call(fakeThis)).to.be(undefined);
        });
      });
    });
  });
});
