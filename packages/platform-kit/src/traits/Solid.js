const {Solid} = require('@snakesilk/platform-traits');

function parseAttack(node, attr) {
    const attack = node.getAttribute(attr);
    if (attack) {
        const surfaces = [];
        const SIDES = Solid.SIDES;
        const map = {
            'top': SIDES.TOP,
            'bottom': SIDES.BOTTOM,
            'left': SIDES.LEFT,
            'right': SIDES.RIGHT,
        }
        const attacks = attack.split(' ');
        for (let i = 0, l = attacks.length; i !== l; ++i) {
            const a = attacks[i];
            if (map[a] === undefined) {
                throw new Error(`Invalid attack direction "${a}".`);
            }
            surfaces.push(map[a]);
        }
        return surfaces;
    }
    return undefined;
}

function factory(parser, node) {
    const attackAccept = parseAttack(node, 'attack');
    const fixed = parser.getBool(node, 'fixed') || false;
    const obstructs = parser.getBool(node, 'obstructs') || false;

    return function createSolid() {
        const solid = new Solid();

        solid.fixed = fixed;
        solid.obstructs = obstructs;

        if (attackAccept) {
            solid.attackAccept = attackAccept;
        }

        return solid;
    };
}

module.exports = factory;