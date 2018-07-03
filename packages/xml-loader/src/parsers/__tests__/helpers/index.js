const {Trait} = require('@snakesilk/engine');

function createFakeTraitFactory(name) {
  return function factory() {
    return function createTrait() {
      const trait = new Trait();
      trait.NAME = name;
      return trait;
    };
  };
}

module.exports = {
  createFakeTraitFactory,
};
