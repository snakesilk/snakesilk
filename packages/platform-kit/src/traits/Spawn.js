const {Vector2} = require('three');
const {Spawn} = require('@snakesilk/platform-traits');

function factory(parser, node) {
    const entityNodes = node.getElementsByTagName('entity');

    return Promise.all([...entityNodes].map(entityNode => {
        const offsetNode = entityNode.getElementsByTagName('offset')[0];
        let offset;
        if (offsetNode) {
            offset = parser.getVector3(offsetNode) || undefined;
        }
        const event = parser.getAttr(entityNode, 'event') || 'death';
        const entityId = parser.getAttr(entityNode, 'id');
        return parser.loader.resourceManager.get('entity', entityId)
        .then(constructor => {
            return [event, constructor, offset];
        });
    }))
    .then(items => {
        return function createSpawn() {
            const trait = new Spawn();
            items.forEach(([event, constructor, offset]) => {
                trait.addItem(event, constructor, offset);
            });
            return trait;
        };
    });
}

module.exports = factory;
