const {Vector2} = require('three');
const {Jump} = require('@snakesilk/platform-traits');

function factory(parser, node) {
    const duration = parser.getFloat(node, 'duration');
    const force = new Vector2();
    force.x = parser.getFloat(node, 'forward') || 0;
    force.y = parser.getFloat(node, 'force') || 500;

    return function createJump() {
        const trait = new Jump();
        if (duration) {
            trait.duration = duration;
        }
        trait.force.copy(force);
        return trait;
    };
}

module.exports = factory;
