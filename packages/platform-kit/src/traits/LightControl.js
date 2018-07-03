const {Color} = require('three');
const {LightControl} = require('@snakesilk/platform-traits');

function factory(parser, node) {
    const color = parser.getColor(node) || new Color(1, 1, 1);
    return function createLightControl() {
        const trait = new LightControl();
        trait.color.copy(color);
        return trait;
    };
}

module.exports = factory;
