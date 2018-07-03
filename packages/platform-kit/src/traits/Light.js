const {Color, Object3D, PointLight, SpotLight, Vector3} = require('three');
const {Util: {ensure}} = require('@snakesilk/xml-loader');
const {Light} = require('@snakesilk/platform-traits');

function parseLocation(parser, node) {
    const positionNode = node.querySelector('position');
    const position = positionNode && parser.getVector3(positionNode) || new Vector3();

    return function applyLocation(light) {
        light.position.copy(position);
    };
}

function parseState(parser, node) {
    const state = node.getAttribute('state') === 'off'
        ? false
        : true;

    return function applyState(lamp) {
        if (state) {
            lamp.on();
        } else {
            lamp.off();
        }
    };
}

function parseTarget(parser, node) {
    const targetNode = node.querySelector('target');
    const target = targetNode && parser.getVector3(targetNode);

    return function applyTarget(light) {
        if (target) {
            light.target.position.copy(target);
        }
    };
}

function parsePointLight(parser, node) {
    ensure(node, 'point');
    const color = parser.getColor(node, 'color') || new Color(1, 1, 1);
    const intensity = parser.getFloat(node, 'intensity') || undefined;
    const distance = parser.getFloat(node, 'distance') || undefined;

    const applyLocation = parseLocation(parser, node);
    const applyState = parseState(parser, node);

    return function createPointLight() {
        const light = new PointLight(
            color.clone(),
            intensity,
            distance
        );
        applyLocation(light);
        const lamp = new Light.Lamp(light);
        applyState(lamp);
        return lamp;
    };
}

function parseSpotLight(parser, node) {
    ensure(node, 'spot');
    const color = parser.getColor(node, 'color');
    const intensity = parser.getFloat(node, 'intensity') || undefined;
    const distance = parser.getFloat(node, 'distance') || undefined;
    const angle = parser.getFloat(node, 'angle') || undefined;
    const exponent = parser.getFloat(node, 'exponent') || undefined;

    const applyLocation = parseLocation(parser, node);
    const applyTarget = parseTarget(parser, node);
    const applyState = parseState(parser, node);

    return function createSpotLight() {
        const light = new SpotLight(
            color.clone(),
            intensity,
            distance,
            angle,
            exponent
        );
        applyLocation(light);
        applyTarget(light);
        const lamp = new Light.Lamp(light);
        applyState(lamp);
        return lamp;
    };
}

function factory(parser, node) {
    const lampNodes = node.querySelectorAll('lamps > *');
    const lampFactories = [];
    [...lampNodes].forEach(node => {
        const type = node.tagName;
        if (type === 'point') {
            lampFactories.push(parsePointLight(parser, node));
        } else if (type === 'spot') {
            lampFactories.push(parseSpotLight(parser, node));
        }
    });

    return function createLight() {
        const trait = new Light();
        lampFactories.forEach(createLamp => {
            trait.addLamp(createLamp());
        });
        return trait;
    };
}

module.exports = factory;
