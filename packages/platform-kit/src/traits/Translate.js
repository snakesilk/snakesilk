const {Vector2} = require('three');
const {Translate} = require('@snakesilk/platform-traits');

function factory(parser, node) {
    const velocity = parser.getVector2(node) || new Vector2();

    return function createTranslate() {
        const trait = new Translate();
        trait.velocity.copy(velocity);
        return trait;
    };
}

module.exports = factory;
