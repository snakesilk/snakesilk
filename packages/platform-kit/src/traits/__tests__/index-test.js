const expect = require('expect.js');

const {createNode} = require('@snakesilk/testing/xml');
const {Loader} = require('@snakesilk/engine');
const {Parser} = require('@snakesilk/xml-loader');
const PlatformTraits = require('@snakesilk/platform-traits');

const registry = require('..');

describe('Registry', () => {
  let loader;

  beforeEach(() => {
    loader = new Loader();
    loader.traits.add(registry);
  });

  [
    ['attach', 'Attach'],
    ['blink', 'Blink'],
    ['climbable', 'Climbable'],
    ['climber', 'Climber'],
    ['contact-damage', 'ContactDamage'],
    ['death-spawn', 'DeathSpawn'],
    ['death-zone', 'DeathZone'],
    ['disappearing', 'Disappearing'],
    ['environment', 'Environment'],
    ['fixed-force', 'FixedForce'],
    ['glow', 'Glow'],
    ['health', 'Health'],
    ['invincibility', 'Invincibility'],
    ['jump', 'Jump'],
    ['lifetime', 'Lifetime'],
    ['light', 'Light'],
    ['light-control', 'LightControl'],
    ['move', 'Move'],
    ['physics', 'Physics'],
    ['pickupable', 'Pickupable'],
    ['projectile', 'Projectile'],
    ['rotate', 'Rotate'],
    ['solid', 'Solid'],
    ['spawn', 'Spawn'],
    ['translate', 'Translate'],
  ].forEach(([shortName, traitName]) => {
    describe(`when trait node name is "${shortName}"`, function() {
      let parser, trait;

      beforeEach(() => {
        parser = new Parser.TraitParser(loader);
      });

      it(`returns a factory that creates ${traitName}`, () => {
        const node = createNode(`<trait name="${shortName}"/>`);

        return parser.parseTrait(node)
        .then(factory => {
          const trait = factory();
          expect(trait).to.be.a(PlatformTraits[traitName]);
        });
      });
    });
  });
});