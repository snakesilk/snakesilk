const expect = require('expect.js');
const sinon = require('sinon');

const {Entity, World} = require('@snakesilk/engine');
const Physics = require('../Physics');
const Jump = require('../Jump');
const Solid = require('../Solid');

describe('Jump', function() {
  let jump, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      jump = new Jump();
    });

    it('has name', () => {
      expect(jump.NAME).to.be('jump');
    });

    describe('when applied', () => {
      beforeEach(() => {
        host = new Entity();
        host.applyTrait(jump);
      });

      it('exposes trait as "attach"', () => {
        expect(host.jump).to.be(jump);
      });

      it.skip('maintains jump height despite variations in time', function() {
        const step = 1/120;

        const world = new World();

        const ground = new Entity();
        ground.applyTrait(new Solid());
        ground.addCollisionRect(1000, 10);
        ground.position.set(0, 0);

        const jumper = new Entity();
        jumper.addCollisionRect(10, 10);
        jumper.position.set(0, 30);
        jumper.applyTrait(new Solid());
        jumper.applyTrait(new Physics());
        jumper.physics.mass = 1;
        jumper.applyTrait(new Jump());
        jumper.jump.force.x = 10000;

        world.addObject(jumper);
        world.addObject(ground);

        let maxLoops = 40;
        expect(jumper.jump._ready).to.be(false);
        while (jumper.jump._ready === false && maxLoops--) {
          world.updateTime(step);
        }
        expect(jumper.jump._ready).to.be(true);
        expect(jumper.position.y).to.equal(10);
      });
    });
  });
});
