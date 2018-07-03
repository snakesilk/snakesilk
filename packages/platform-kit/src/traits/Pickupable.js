const {Vector2} = require('three');
const {Pickupable} = require('@snakesilk/platform-traits');

function factory(parser, node) {
    const props = {};
    const propNodes = node.getElementsByTagName('property');
    for (let propNode, i = 0; propNode = propNodes[i]; ++i) {
        const key = propNode.attributes[0].name;
        const value = propNode.attributes[0].value;
        props[key] = parseFloat(value) || value;
    }

    return function createPickupable() {
        const trait = new Pickupable();
        for (let key in props) {
            trait.properties[key] = props[key];
        }
        return trait;
    };
}

module.exports = factory;
