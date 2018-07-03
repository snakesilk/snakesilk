const expect = require('expect.js');
const sinon = require('sinon');
const {createNode} = require('@snakesilk/testing/xml');

const {Animation, UVCoords} = require('@snakesilk/engine');
const AnimationParser = require('../AnimationParser');

describe('AnimationParser', () => {
  let parser;
  const textureSize = {x: 128, y: 128};

  beforeEach(() => {
    parser = new AnimationParser();
  });

  describe('#parseAnimation', () => {
    let node;

    describe('when animation node has size specified', () => {
      before(() => {
        node = createNode(`<animations w="48" h="48">
          <animation id="moot" w="24" h="22">
            <frame x="32" y="16"/>
          </animation>
        </animations>`);
      });

      it('uses size from animation node', () => {
        const animationNode = node.querySelector('animation');
        const animation = parser.parseAnimation(animationNode, textureSize);
        expect(animation.getValue()).to.eql(new UVCoords(
          {x: 32, y: 16},
          {x: 24, y: 22},
          {x: 128, y: 128}));
      });
    });

    describe('when frame has size specified', () => {
      before(() => {
        node = createNode(`<animations w="48" h="48">
          <animation id="moot" w="24" h="22">
            <frame x="32" y="16" w="12" h="11"/>
          </animation>
        </animations>`);
      });

      it('should use size from frame', () => {
        const animationNode = node.querySelector('animation');
        const animation = parser.parseAnimation(animationNode, textureSize);
        expect(animation.getValue()).to.eql(new UVCoords(
          {x: 32, y: 16},
          {x: 12, y: 11},
          {x: 128, y: 128}));
      });
    });

    describe('when wrapped in <loop>', () => {
      before(() => {

      });

      it('duplicates a single frame', () => {
        const node = createNode(`<animations w="48" h="48">
          <animation id="moot" w="24" h="22">
            <loop count="13">
              <frame x="32" y="16" duration="1"/>
            </loop>
          </animation>
        </animations>`);
        const animationNode = node.querySelector('animation');
        const animation = parser.parseAnimation(animationNode, textureSize);
        expect(animation.length).to.be(13);
      });

      it('repeats group', () => {
        const node = createNode(`<animations w="48" h="48">
          <animation id="moot" w="24" h="22">
            <loop count="3">
              <frame x="32" y="16" duration="1"/>
              <frame x="32" y="16" duration="3"/>
            </loop>
          </animation>
        </animations>`);
        const animationNode = node.querySelector('animation');
        const animation = parser.parseAnimation(animationNode, textureSize);
        const frames = animation.timeline.frames;

        expect(frames[0].duration).to.be(1);
        expect(frames[1].duration).to.be(3);
        expect(frames[2].duration).to.be(1);
        expect(frames[3].duration).to.be(3);
        expect(frames[4].duration).to.be(1);
        expect(frames[5].duration).to.be(3);
      });

      it('repeates two loop groups', () => {
        const node = createNode(`<animations w="48" h="48">
          <animation id="moot" w="20" h="10">
            <loop count="2">
              <frame x="1" y="1" duration="13"/>
              <frame x="2" y="2" duration="19"/>
            </loop>
            <loop count="3">
              <frame x="1" y="1" duration="27"/>
              <frame x="2" y="2" duration="18"/>
            </loop>
          </animation>
        </animations>`);
        const animationNode = node.querySelector('animation');
        const animation = parser.parseAnimation(animationNode, textureSize);
        expect(animation.length).to.be(10);

        const frames = animation.timeline.frames;
        expect(frames[0].duration).to.be(13);
        expect(frames[1].duration).to.be(19);
        expect(frames[2].duration).to.be(13);
        expect(frames[3].duration).to.be(19);
        expect(frames[4].duration).to.be(27);
        expect(frames[5].duration).to.be(18);
        expect(frames[6].duration).to.be(27);
        expect(frames[7].duration).to.be(18);
        expect(frames[8].duration).to.be(27);
        expect(frames[9].duration).to.be(18);
      });

      describe('nesting loops', () => {
        it('supports directly nested loops', () => {
          const node = createNode(`<animations w="48" h="48">
            <animation id="moot" w="20" h="10">
              <loop count="2">
                <loop count="3">
                  <frame x="1" y="1" duration="13"/>
                  <frame x="2" y="2" duration="19"/>
                </loop>
              </loop>
            </animation>
          </animations>`);
          const animationNode = node.querySelector('animation');
          const animation = parser.parseAnimation(animationNode, textureSize);
          expect(animation.length).to.be(12);

          const frames = animation.timeline.frames;
          expect(frames[0].duration).to.be(13);
          expect(frames[1].duration).to.be(19);
          expect(frames[2].duration).to.be(13);
          expect(frames[3].duration).to.be(19);
          expect(frames[4].duration).to.be(13);
          expect(frames[5].duration).to.be(19);
          expect(frames[6].duration).to.be(13);
          expect(frames[7].duration).to.be(19);
          expect(frames[8].duration).to.be(13);
          expect(frames[9].duration).to.be(19);
        });

        it('combined nested loops', () => {
          const node = createNode(`<animations w="48" h="48">
            <animation id="moot" w="20" h="10">
              <loop count="2">
                <frame x="1" y="1" duration="101"/>
                <loop count="3">
                  <frame x="1" y="1" duration="201"/>
                  <loop count="6">
                    <frame x="1" y="1" duration="301"/>
                  </loop>
                  <frame x="2" y="2" duration="201"/>
                </loop>
                <frame x="1" y="1" duration="102"/>
              </loop>
            </animation>
          </animations>`);
          const animationNode = node.querySelector('animation');
          const animation = parser.parseAnimation(animationNode, textureSize);
          expect(animation.length).to.be(52);

          const frames = animation.timeline.frames;

          [
            101,
            201,
            301,
            301,
            301,
            301,
            301,
            301,
            201,
            201,
            301,
            301,
            301,
            301,
            301,
            301,
            201,
            201,
            301,
            301,
            301,
            301,
            301,
            301,
            201,
            102,
            101,
            201,
            301,
            301,
            301,
            301,
            301,
            301,
            201,
            201,
            301,
            301,
            301,
            301,
            301,
            301,
            201,
            201,
            301,
            301,
            301,
            301,
            301,
            301,
            201,
            102,
          ].forEach((duration, index) => {
            expect(frames[index].duration).to.be(duration);
          });
        });
      });
    });
  });
});
