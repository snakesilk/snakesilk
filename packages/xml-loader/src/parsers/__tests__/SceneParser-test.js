const expect = require('expect.js');
const sinon = require('sinon');
const fs = require('fs');

const mocks = require('@snakesilk/testing/mocks');
const {createNode, readXMLFile} = require('@snakesilk/testing/xml');

const THREE = require('three');
const {Game, Loader, World} = require('@snakesilk/engine');
const SceneParser = require('../SceneParser');

const {createFakeTraitFactory} = require('./helpers');

describe('SceneParser', () => {
  let scene;

  class AudioMock{};

  function parseScene(parser, node) {
    return parser.getScene(node).then(context => {scene = context.scene});
  }

  describe(`when <audio> present`, () => {
    const mockAudio = new AudioMock();
    let loader;

    beforeEach(() => {
      const node = createNode(`<scene>
        <audio>
          <music src="./intro/intro.ogg" id="intro"/>
        </audio>
      </scene>`);
      loader = new Loader();
      sinon.stub(loader.resourceLoader, 'loadAudio', () => {
        return Promise.resolve(mockAudio);
      });

      const parser = new SceneParser(loader);
      return parseScene(parser, node);
    });

    it('fetches audio from "src"', () => {
      expect(loader.resourceLoader.loadAudio.callCount).to.be(1);
      expect(loader.resourceLoader.loadAudio.lastCall.args)
        .to.eql(['./intro/intro.ogg']);
    });

    it('adds audio to scene', (done) => {
      scene.audio.events.bind(scene.audio.EVENT_PLAY, (audio) => {
        expect(audio).to.be(mockAudio);
        done();
      });
      scene.audio.play('intro');
    });
  });

  [
    ['solids', 'solid'],
    ['deathzones', 'deathZone'],
    ['climbables', 'climbable'],
  ].forEach(([tag, trait]) => {
    describe(`when <behaviors><${tag}> present`, () => {
      beforeEach(() => {
        const node = createNode(`<scene>
          <layout>
            <behaviors>
              <${tag}>
                <rect x="136" y="-184" w="240" h="16"/>
                <rect x="1976.23" y="-408.2112" w="16.5" h="32.23"/>
                <rect w="125.24" h="45.24"/>
              </${tag}>
            </behaviors>
          </layout>
        </scene>`);
        const parser = new SceneParser(new Loader());
        return parseScene(parser, node);
      });

      it(`has only ${tag} in world`, () => {
        const objects = scene.world.objects.filter(o => o[trait]);
        expect(objects).to.have.length(3);
      });

      it('provides default position', () => {
        expect(scene.world.objects[2].position).to.eql({ x: 0, y: 0, z: 0 });
      });

      it('honors positions and sizes', () => {
        expect(scene.world.objects[0].position).to.eql({ x: 136, y: -184, z: 0 });
        expect(scene.world.objects[0].collision[0].w).to.eql(240);
        expect(scene.world.objects[0].collision[0].h).to.eql(16);

        expect(scene.world.objects[1].position).to.eql({ x: 1976.23, y: -408.2112, z: 0 });
        expect(scene.world.objects[1].collision[0].w).to.eql(16.5);
        expect(scene.world.objects[1].collision[0].h).to.eql(32.23);
      });
    });
  });

  describe('when parsing full scene', () => {
    let node;

    const mockAudio = new AudioMock();

    before(() => {
      node = readXMLFile(__dirname + '/fixtures/scene.xml').childNodes[0];
    });

    beforeEach(() => {
      mocks.AudioContext.mock();
      mocks.Image.mock();
      mocks.requestAnimationFrame.mock();
      mocks.THREE.WebGLRenderer.mock();

      const loader = new Loader(new Game());

      loader.traits.add({
        'solid': createFakeTraitFactory('solid'),
        'disappearing': createFakeTraitFactory('disappearing'),
      });

      sinon.stub(loader.resourceLoader, 'loadImage', () => {
        return Promise.resolve(new mocks.Canvas())
      });
      sinon.stub(loader.resourceLoader, 'loadAudio', () => {
        return Promise.resolve(mockAudio);
      });

      sinon.stub(World.prototype, 'simulateTime');

      const parser = new SceneParser(loader);
      return parseScene(parser, node);
    });

    afterEach(() => {
      mocks.AudioContext.restore();
      mocks.Image.restore();
      mocks.requestAnimationFrame.restore();
      mocks.THREE.WebGLRenderer.restore();

      World.prototype.simulateTime.restore();
    });

    describe('when instantiated', () => {
      describe('#getScene', () => {
        it('creates objects with valid positions', () => {
          scene.world.objects.forEach(object => {
            expect(object.position).to.be.a(THREE.Vector3);
            expect(object.position.x).to.be.a('number');
            expect(object.position.y).to.be.a('number');
            expect(object.position.z).to.be.a('number');
          });
        });

        it('creates DeathZones', () => {
          const deathZones = scene.world.objects.filter(object => object.deathZone);
          expect(deathZones).to.have.length(3);
        });

        it('creates Ladders', () => {
          const ladders = scene.world.objects.filter(object => object.climbable);
          expect(ladders).to.have.length(2);
        });

        it('creates Solids', () => {
          const solids = scene.world.objects.filter(object => object.solid);
          expect(solids).to.have.length(7);
        });

        it('should not put any objects in scene without texture ', () => {
          scene.world.scene.children.forEach(function(mesh) {
            if (mesh.material && !mesh.material.map) {
              console.error('Mesh missing texture', mesh);
            }
          });
        });

        it('parses gravity as Vector3', () => {
          expect(scene.world.gravityForce.x).to.be(1);
          expect(scene.world.gravityForce.y).to.be(9.81);
          expect(scene.world.gravityForce.z).to.be(0);
        });

        describe('Audio', () => {
          it('was parsed', (done) => {
            scene.audio.events.bind(scene.audio.EVENT_PLAY, (audio) => {
              expect(audio).to.be(mockAudio);
              done();
            });
            scene.audio.play('intro');
          });
        });

        describe('Camera', () => {
          it('have smoothing', () => {
            expect(scene.camera.smoothing).to.equal(13.5);
          });

          it('have paths', () => {
            const paths = scene.camera.paths;
            expect(paths).to.have.length(3);
            expect(paths[0].window[0]).to.eql({x: 0, y: -208, z: 0});
            expect(paths[0].window[1]).to.eql({x: 2048, y: 0, z: 0});
            expect(paths[0].constraint[0]).to.eql({x: 180, y: -120, z: 150});
            expect(paths[0].constraint[1]).to.eql({x: 1920, y: -120, z: 150});
          });
        });

        describe('Entity parsing', () => {
          it('should name object', () => {
            const object = scene.world.getObject('my-test-entity');
            expect(object.id).to.equal('my-test-entity');
            expect(object.name).to.equal('test');
          });
        });

        it.skip('should parse checkpoints', () => {
          expect(scene.checkPoints).to.have.length(3);
          expect(scene.checkPoints[0]).to.eql({pos: {x: 136, y: -165}, radius: 100});
          expect(scene.checkPoints[1]).to.eql({pos: {x: 1920, y: -661}, radius: 100});
          expect(scene.checkPoints[2]).to.eql({pos: { x: 4736, y: -1109}, radius: 13});
        });
      });
    });
  });
});
