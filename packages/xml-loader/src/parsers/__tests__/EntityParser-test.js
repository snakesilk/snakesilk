const expect = require('expect.js');
const sinon = require('sinon');
const mocks = require('@snakesilk/testing/mocks');
const {createNode, readXMLFile} = require('@snakesilk/testing/xml');

const {Texture} = require('three');
const {Animation, BitmapFont, Entity, Loader, Objects, Trait, UVCoords} = require('@snakesilk/engine');
const EntityParser = require('../EntityParser');

const {createFakeTraitFactory} = require('./helpers');

describe('EntityParser', () => {
  let loader;

  beforeEach(() => {
    loader = new Loader();
    loader.entities.add({
      'MyGuy': Entity,
    });

    loader.traits.add({
      'jump': createFakeTraitFactory('jump'),
      'physics': createFakeTraitFactory('physics'),
    });
  });

  describe('#getObjects', () => {
    const MOCK_CANVAS = new mocks.Canvas();
    const MOCK_FONT = new BitmapFont.Text(undefined, {x: 20, y: 10}, {x: 40, y: 20});
    let node, objects;

    before(() => {
      node = readXMLFile(__dirname + '/fixtures/character.xml').childNodes[0];
    });

    beforeEach(() => {
      mocks.Image.mock();

      loader.resourceManager.addFont('mock-font', sinon.stub().returns(MOCK_FONT));

      sinon.stub(loader.resourceLoader, 'loadImage', () => {
        return Promise.resolve(MOCK_CANVAS)
      });

      const parser = new EntityParser(loader);
      return parser.getObjects(node).then(_o => {objects = _o});
    });

    afterEach(() => {
      mocks.Image.restore();
    });

    it('returns an object indexed by object names', () => {
      expect(objects).to.be.an(Object);
      expect(objects).to.have.property('GIJoe');
    });

    it('initializes font with text from node', () => {
      return loader.resourceManager.get('font', 'mock-font')
      .then(font => {
        expect(font.callCount).to.be(1);
        expect(font.lastCall.args).to.eql(['Hola Bandola']);
      });
    });

    describe('parsed candidate', () => {
      let candidate;

      beforeEach(() => {
        candidate = objects['GIJoe'];
      });

      it('contains reference to parsed node', () => {
        expect(candidate.node).to.be(node.querySelector('entity[id=GIJoe]'));
      });

      it('containes a constructor for object', () => {
        expect(candidate.constructor).to.be.a(Function);
      });

      describe('constructed instance', () => {
        let instance;

        beforeEach(() => {
          instance = new candidate.constructor();
        });

        it('is an Entity', () => {
          expect(instance).to.be.an(Entity);
        });

        it('can be checked if it is an instance of', () => {
          expect(instance).to.be.a(candidate.constructor);
        });

        it('contains animation router', () => {
          expect(instance.routeAnimation).to.be.a(Function);
          expect(instance.routeAnimation()).to.be('test-value-is-fubar');
        });

        ['idle', 'run', 'run-fire'].forEach(name => {
          it(`contains "${name}" animation`, () => {
            expect(instance.animations.get(name)).to.be.an(Animation);
          });
        });

        it('has default animation', () => {
          expect(instance.animations.has('__default')).to.be(true);
          expect(instance.animations.get('__default'))
          .to.be(instance.animations.get('idle'));
        });

        describe('#setAnimsetAnimation', () => {
          it('sets specified animation by name successfully', () => {
            instance.setAnimation('run');
            instance.updateAnimators(0);
            const uvs = instance.animations.get('run').getValue(0);
            expect(instance.model.geometry.faceVertexUvs[0][0]).to.eql(uvs[0]);
            expect(instance.model.geometry.faceVertexUvs[0][1]).to.eql(uvs[1]);
          });
        });

        it('has traits', () => {
          expect(instance.traits.length).to.be(2);
          expect(instance.jump).to.be.ok();
          expect(instance.physics).to.be.ok();
        });

        it('has default animation applied', () => {
          const uvs = instance.animations.get('__default').getValue(0);
          expect(instance.model.geometry.faceVertexUvs[0][0]).to.eql(uvs[0]);
          expect(instance.model.geometry.faceVertexUvs[0][1]).to.eql(uvs[1]);
        });

        it.skip('should take out face indices properly', function() {
          const object = scene.world.getObject('json-index-only');
          expect(object.animators[0].indices)
          .to.eql([0, 1, 2, 3, 4, 100, 112]);
          object = scene.world.getObject('range-index-star');
          expect(object.animators[0].indices)
          .to.eql([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]);
        });

        describe('Animations', () => {
          it('have correct UV maps', () => {
            const uvs = instance.animations.get('idle').getValue(0);
            expect(uvs).to.be.an(Array);
            expect(uvs[0][0].x).to.equal(0);
            expect(uvs[0][0].y).to.equal(1);
            expect(uvs[0][1].x).to.equal(0);
            expect(uvs[0][1].y).to.equal(0.8125);
            expect(uvs[0][2].x).to.equal(0.1875);
            expect(uvs[0][2].y).to.equal(1);

            expect(uvs[1][0].x).to.equal(0);
            expect(uvs[1][0].y).to.equal(0.8125);
            expect(uvs[1][1].x).to.equal(0.1875);
            expect(uvs[1][1].y).to.equal(0.8125);
            expect(uvs[1][2].x).to.equal(0.1875);
            expect(uvs[1][2].y).to.equal(1);
          });

          it('have group set to null if not specified', () => {
            expect(instance.animations.get('idle').group).to.be(null);
          });

          it('have group set to string if specified', () => {
            expect(instance.animations.get('run').group).to.be('run');
            expect(instance.animations.get('run-fire').group).to.be('run');
          });
        });

        describe('Textures', () => {
          let textures;

          it('is a Map', () => {
            expect(instance.textures).to.be.a(Map);
          });

          it('are indexed by texture names', () => {
            expect(instance.textures.has('headlight_lensflare')).to.be(true);
            expect(instance.textures.has('megaman-p')).to.be(true);
            expect(instance.textures.has('megaman-a')).to.be(true);
            expect(instance.textures.has('megaman-b')).to.be(true);
            expect(instance.textures.has('megaman-c')).to.be(true);
            expect(instance.textures.has('megaman-f')).to.be(true);
            expect(instance.textures.has('megaman-h')).to.be(true);
            expect(instance.textures.has('megaman-m')).to.be(true);
            expect(instance.textures.has('megaman-q')).to.be(true);
            expect(instance.textures.has('megaman-w')).to.be(true);
            expect(instance.textures.has('megaman-m')).to.be(true);
          });

          it('provide texture size', () => {
            expect(instance.textures.get('megaman-p').size).to.eql({x: 256, y: 256});
            expect(instance.textures.get('headlight_lensflare').size).to.eql({x: 256, y: 128});
          });

          it('provide texture instances', () => {
            expect(instance.textures.get('megaman-p').texture).to.be.a(Texture);
            expect(instance.textures.get('headlight_lensflare').texture).to.be.a(Texture);
          });

          it('should have the first found texture as default', () => {
            expect(instance.textures.get('__default'))
            .to.be(instance.textures.get('headlight_lensflare'));
          });

          it('uses specified image', () => {
            expect(instance.textures.get('__default').texture.image).to.be(MOCK_CANVAS);
          });
        });
      });
    });

    describe('parsed text mesh', () => {
      let text;

      beforeEach(() => {
        text = objects['TextEntity'];
      });

      it('contains reference to parsed node', () => {
        expect(text.node).to.be(node.querySelector('entity[id=TextEntity]'));
      });

      it('containes a constructor for object', () => {
        expect(text.constructor).to.be.a(Function);
      });
    });
  });

  describe('Regression Tests', () => {
    it('only finds first hand object nodes', (done) => {
      const node = createNode(`<entities>
        <entity id="CollidableName"/>

        <entity id="UniqueName">
          <node1>
            <entity id="CollidableName"/>
            <node2>
              <entity id="CollidableName"/>
            </node2>
          </node1>
        </entity>
      </entities>`);

      const parser = new EntityParser(new Loader());
      parser.getObjects(node).then(() => done()).catch(done);
    });
  });
});

