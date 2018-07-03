const {Vector2} = require('three');
const {FixedForce} = require('@snakesilk/platform-traits');

function factory(parser, node) {
    const vec = new Vector2;
    vec.x = parser.getFloat(node, 'x') || 0;
    vec.y = parser.getFloat(node, 'y') || 0;

    return function createFixedForce() {
        const fixedForce = new FixedForce();
        fixedForce.force.copy(vec);
        return fixedForce;
    };
}

module.exports = factory;
