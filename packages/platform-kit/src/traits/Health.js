const {Vector2} = require('three');
const {Health} = require('@snakesilk/platform-traits');

function factory(parser, node) {
    const max = parser.getFloat(node, 'max');

    return function createHealth() {
        const trait = new Health();

        if (max) {
            trait.energy.max = max;
        }

        return trait;
    };
}

module.exports = factory;
