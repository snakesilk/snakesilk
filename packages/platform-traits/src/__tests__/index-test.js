const expect = require('expect.js');
const sinon = require('sinon');

const Main = require('..');

describe('Main export', () => {
  [
    'Attach',
    'Blink',
    'Climbable',
    'Climber',
    'ContactDamage',
    'DeathSpawn',
    'DeathZone',
    'Disappearing',
    'Environment',
    'FixedForce',
    'Glow',
    'Health',
    'Invincibility',
    'Jump',
    'Lifetime',
    'Light',
    'LightControl',
    'Move',
    'Physics',
    'Pickupable',
    'Projectile',
    'Rotate',
    'Solid',
    'Spawn',
    'Translate'
  ].forEach(traitName => {
    it(`exports ${traitName}`, () => {
      expect(Main[traitName]).to.be(require('../' + traitName));
    });
  });
});
