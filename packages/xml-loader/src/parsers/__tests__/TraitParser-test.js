const expect = require('expect.js');
const sinon = require('sinon');
const {createNode} = require('@snakesilk/testing/xml');

const {Entity, Loader, Trait} = require('@snakesilk/engine');
const TraitParser = require('../TraitParser');

describe('TraitParser', () => {
  let parser, loader;

  beforeEach(() => {
    loader = new Loader();
    parser = new TraitParser(loader);
  });

  describe('#createFactory', () => {
    class MyTrait extends Trait {
      constructor() {
        super();
        this.force = 12;
        this.event = undefined;
        this.damage = 0;
        this.create = undefined;
        this.find = undefined;
      }
    }

    let factory;

    beforeEach(() => {
      factory = TraitParser.createFactory(MyTrait);
    });

    it('returns a function', () => {
      expect(factory).to.be.a(Function);
    });

    describe('when parsing using factory', () => {
      let trait;

      beforeEach(() => {
        const node = createNode(`<trait
          force="1124.24"
          event="recycle"
          damage="12"
          create="true"
          find="false"
          unmatched="124.23"
        />`);
        trait = factory(parser, node)();
      });

      it('applies matched properties to trait', () => {
        expect(trait.force).to.equal(1124.24);
        expect(trait.event).to.equal('recycle');
        expect(trait.damage).to.equal(12);
        expect(trait.create).to.be(true);
        expect(trait.find).to.be(false);
      });

      it('ignores unmatched properties in trait', () => {
        expect(trait).to.not.have.property('unmatched');
      });
    });
  });

  describe('#parseTraits', () => {
    describe('when node illegal', () => {
      it('throws an exception', () => {
        expect(() => {
          parser.parseTraits(createNode('<invalid/>'));
        }).to.throwError(error => {
          expect(error.message).to.be('<invalid></invalid> must match selector "traits"');
        });
      });
    });

    describe('when node valid', () => {
      let result, node;

      beforeEach(() => {
        sinon.stub(parser, 'parseTrait')
          .onCall(0).returns('result a')
          .onCall(1).returns('result b');

        node = createNode(`<traits>
          <trait name="test"/>
          <test/>
        </traits>`);

        return parser.parseTraits(node)
        .then(r => {
          result = r;
        });
      });

      it('calls #parseTrait for every child node', () => {
        expect(parser.parseTrait.callCount).to.be(2);
        expect(parser.parseTrait.getCall(0).args[0]).to.be(node.children[0]);
        expect(parser.parseTrait.getCall(1).args[0]).to.be(node.children[1]);
      });

      it('resolves all return values from #parseTrait', () => {
        expect(result[0]).to.be('result a');
        expect(result[1]).to.be('result b');
      });
    });
  });

  describe('#parseTrait', () => {
    describe('when trait has been registered', () => {
      [
        `<my-trait/>`,
        `<trait name="my-trait"/>`,
      ].forEach(xml => {
        describe(`using node format ${xml}`, () => {
          const MOCK_CONSTRUCTOR = Symbol('mock constructor');
          let constructor, factory, node;

          beforeEach(() => {
            factory = sinon.stub().returns(MOCK_CONSTRUCTOR);

            loader.traits.add({
              'my-trait': factory,
            });
            node = createNode(xml);
            return parser.parseTrait(node)
            .then(c => {
              constructor = c;
            });
          });

          it('resolves constructor created by factory', () => {
            expect(constructor).to.be(MOCK_CONSTRUCTOR);
          });

          it('calls factory with Parser instance and node', () => {
            expect(factory.callCount).to.be(1);
            expect(factory.lastCall.args).to.eql([
              parser,
              node,
            ]);
          });
        });
      });
    });
  });

  describe('#parsePrimitives', () => {
    let props;

    beforeEach(() => {
      const node = createNode(`<trait
        force="1124.24"
        event="recycle"
        yes="true"
        no="false"
      />`);
      props = parser.parsePrimitives(node);
    });

    it('returns a Map', () => {
      expect(props).to.be.a(Map);
    });

    it('parses numbers', () => {
      expect(props.get('force')).to.equal(1124.24);
    });

    it('parses strings', () => {
      expect(props.get('event')).to.equal('recycle');
    });

    it('parses boolean', () => {
      expect(props.get('yes')).to.be(true);
      expect(props.get('no')).to.be(false);
    });
  });
});
