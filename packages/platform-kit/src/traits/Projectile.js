const {Vector2} = require('three');
const {Projectile} = require('@snakesilk/platform-traits');

function factory(parser, node) {
    const damage = parser.getFloat(node, 'damage') || 1;
    const penetrates = parser.getBool(node, 'penetrates') || false;
    const range = parser.getFloat(node, 'range') || 100;
    const speed = parser.getFloat(node, 'speed') || 100;

    return function createProjectile() {
        const trait = new Projectile();
        trait.setDamage(damage);
        trait.setRange(range);
        trait.setSpeed(speed);
        trait.penetratingForce = penetrates;
        return trait;
    };
}

module.exports = factory;
