const expect = require('expect.js');
const sinon = require('sinon');
const {createNode} = require('@snakesilk/testing/xml');

const EventParser = require('../EventParser');
const ActionParser = require('../ActionParser');

describe('EventParser', () => {
  const MOCK_ACTION = Symbol();

  let parser;

  beforeEach(() => {
    parser = new EventParser();
    sinon.stub(ActionParser.prototype, 'getAction').returns(MOCK_ACTION);
  });

  afterEach(() => {
    ActionParser.prototype.getAction.restore();
  });

  describe('#getEvents', () => {
    describe('when parsing <events>', () => {
      let promise, node;

      beforeEach(() => {
        node = createNode(`<events>
          <event name="create">
              <action type="camera-move" to="0,0,140"/>
              <action type="play-sequence" id="intro"/>
          </event>
        </events>`);
        promise = parser.getEvents(node);
      });

      it('parses every action using ActionParser', () => {
        expect(parser.actionParser.getAction.callCount).to.be(2);
        expect(parser.actionParser.getAction.getCall(0).args).to.eql([
          node.querySelectorAll('action')[0],
        ]);
        expect(parser.actionParser.getAction.getCall(1).args).to.eql([
          node.querySelectorAll('action')[1],
        ]);
      });

      it('returns a Promise', () => {
        expect(promise).to.be.a(Promise);
      });

      describe('returned Promise', () => {
        let context;

        beforeEach(() => {
          return promise.then(c => {context = c});
        });

        it('resolves a context', () => {
          expect(context).to.be.an(Object);
        });

        describe('context', () => {
          it('contains events', () => {
            expect(context.events).to.be.an(Array);
            expect(context.events).to.have.length(2);
          });

          describe('events', () => {
            it('has parsed name', () => {
              expect(context.events[0].name).to.be('create');
              expect(context.events[1].name).to.be('create');
            });

            it('has included callback from ActionParser', () => {
              expect(context.events[0].callback).to.be(MOCK_ACTION);
              expect(context.events[1].callback).to.be(MOCK_ACTION);
            });
          });
        });
      });
    });
  });
});
