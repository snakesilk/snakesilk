const {Vector3} = require('three');

/* This dependency is for legacy functionality with <behavior> node and
will be handled by a behavior registry. */
const Traits = require('@snakesilk/platform-traits');

const {Entity, Scene} = require('@snakesilk/engine');

const {children, ensure, find} = require('../util/traverse');
const Parser = require('./Parser');
const CameraParser = require('./CameraParser');
const EventParser = require('./EventParser');
const EntityParser = require('./EntityParser');
const SequenceParser = require('./SequenceParser');
const TraitParser = require('./TraitParser');

const DEFAULT_POS = new Vector3(0, 0, 0);

const BEHAVIOR_MAP = {
    'climbables': createClimbable,
    'deathzones': createDeathZone,
    'solids': createSolid,
};

function createClimbable()
{
    const object = new Entity();
    object.applyTrait(new Traits.Climbable());
    return object;
}

function createDeathZone()
{
    const object = new Entity();
    object.applyTrait(new Traits.DeathZone());
    return object;
}

function createSolid() {
    const object = new Entity();
    const solid = new Traits.Solid();
    solid.fixed = true;
    solid.obstructs = true;
    object.applyTrait(solid);
    return object;
}

class Context {
    constructor(loader) {
        this.loader = loader;
        this.entities = new Map();
        this.bevahiorObjects = [];
        this.layoutObjects = [];
        this.scene = null;
    }

    createEntity(id) {
        return this.getEntity(id)
        .then(entity => {
            return new entity.constructor();
        });
    }

    getEntity(id) {
        if (this.entities.has(id)) {
            return Promise.resolve(this.entities.get(id));
        }

        const resources = this.loader.resourceManager;
        return resources.get('entity', id)
        .then(entity => {
            return {
                constructor: entity
            };
        });

        throw new Error(`Entity "${id}" not defined.`);
    }
}

class SceneParser extends Parser
{
    constructor(loader) {
        super(loader);
        this.cameraParser = new CameraParser(loader);
        this.entityParser = new EntityParser(loader);
        this.eventParser = new EventParser(loader);
        this.sequenceParser = new SequenceParser(loader);
        this.traitParser = new TraitParser(loader);
    }

    createContext(scene = new Scene()) {
        const context = new Context(this.loader);
        context.scene = scene;
        return context;
    }

    getBehavior(node) {
        const type = node.parentNode.tagName.toLowerCase();
        if (!BEHAVIOR_MAP[type]) {
            throw new Error('Behavior ' + type + ' not in behavior map');
        }
        const factory = BEHAVIOR_MAP[type];
        const rect = this.getRect(node);
        const instance = factory();
        instance.addCollisionRect(rect.w, rect.h);
        instance.position.x = rect.x;
        instance.position.y = rect.y;
        instance.position.z = 0;

        return {
            constructor: constructor,
            instance: instance,
            node: node,
        };
    }

    getScene(node) {
        ensure(node, 'scene');

        const context = this.createContext(new Scene());
        context.scene.name = node.getAttribute('name');

        return Promise.all([
            this._parseAudio(node, context),
            this._parseCamera(node, context),
            this._parseEvents(node, context),
            this._parseGlobalEvents(node, context),
            this._parseObjects(node, context),
            this._parseBehaviors(node, context),
            this._parseGravity(node, context),
            this._parseSequences(node, context),
        ]).then(() => {
            return this._parseLayout(node, context);
        }).then(() => {
            return this.loader.resourceLoader.complete();
        }).then(() => {
            /*
            Perform update to "settle" world.
            This is done to prevent audio and other side effects from leaking out on scene start.

            For example, if an entity emits audio when landing after a jump, and placed on the ground in the world from start, the jump land event would be fired on the first frame.
            */
            context.scene.world.simulateTime(0);
            return context;
        });
    }

    _parseAudio(node, {scene}) {
        const nodes = find(node, 'audio > *');
        const tasks = [];
        for (let node, i = 0; node = nodes[i++];) {
            const id = this.getAttr(node, 'id');
            const task = this.getAudio(node)
            .then(audio => {
                scene.audio.add(id, audio);
            });
            tasks.push(task);
        }
        return Promise.all(tasks);
    }

    _parseBehaviors(node, context) {
        const world = context.scene.world;
        const nodes = find(node, 'layout > behaviors > * > rect');
        for (let node, i = 0; node = nodes[i]; ++i) {
            const object = this.getBehavior(node);
            context.bevahiorObjects.push(object);
            world.addObject(object.instance);
        }
    }

    _parseCamera(node, {scene}) {
        const cameraNode = children(node, 'camera')[0];
        if (!cameraNode) {
            return;
        }

        return this.cameraParser.getCamera(cameraNode)
        .then(camera => {
            scene.camera = camera;
        });
    }

    _parseEvents(node, {scene}) {
        const eventsNode = children(node, 'events')[0];
        if (!eventsNode) {
            return Promise.resolve();
        }

        return this.eventParser.getEvents(eventsNode)
        .then(({events}) => {
            events.forEach(event => {
                scene.events.bind(event.name, event.callback);
            });
        });
    }

    _parseGlobalEvents(node, {scene}) {
        const eventsNode = children(node, 'events')[0];
        if (!eventsNode) {
            return;
        }

        const nodes = eventsNode.querySelectorAll('after > action, before > action');
        for (let node, i = 0; node = nodes[i]; ++i) {
            const when = node.parentNode.tagName;
            const type = node.getAttribute('type');
            if (when === 'after' && type === 'goto-scene') {
                const id = node.getAttribute('id');
                scene.events.bind(scene.EVENT_END, () => {
                    this.loader.loadSceneByName(id).then(scene => {
                        this.loader.game.setScene(scene);
                    });
                })
            } else {
                throw new TypeError(`No mathing event for ${when} > ${type}`);
            }
        }
    }

    _parseGravity(node, {scene}) {
        const gravityNode = children(node, 'gravity')[0];
        if (gravityNode) {
            const gravity = this.getVector3(gravityNode);
            scene.world.gravityForce.copy(gravity);
        }
    }

    _parseLayout(node, context) {
        const {scene, layoutObjects} = context;
        const world = scene.world;
        const entityNodes = find(node, 'layout > entities > entity');
        return Promise.all(entityNodes.map(entityNode => {
            return this._parseLayoutObject(entityNode, context)
            .then(layoutObject => {
                world.addObject(layoutObject.instance);
                layoutObjects.push(layoutObject);
            });
        }));
    }

    _parseLayoutObject(node, context) {
        const entityId = node.getAttribute('id');
        const traitNodes = node.getElementsByTagName('trait');

        return Promise.all([
            context.createEntity(entityId),
            context.getEntity(entityId),
            Promise.all([...traitNodes].map(traitNode => {
                return this.traitParser.parseTrait(traitNode);
            })),
        ])
        .then(([
            instance,
            entity,
            traits,
        ]) => {
            const instanceId = node.getAttribute('instance-id');
            const direction = this.getInt(node, 'dir') || 1;
            const position = this.getPosition(node) || DEFAULT_POS;

            instance.id = instanceId;
            instance.direction.set(direction, 0);
            instance.position.copy(position);

            if (instance.model) {
                const scale = this.getFloat(node, 'scale') || 1;
                instance.model.scale.multiplyScalar(scale);
            }

            for (const Trait of traits) {
                const trait = new Trait();
                instance.applyTrait(trait);
            }

            return {
                sourceNode: entity.node,
                node: node,
                constructor: entity.constructor,
                instance: instance,
            };
        });
    }

    _parseObjects(node, context) {
        const nodes = children(node, 'entities');
        if (!nodes.length) {
            return Promise.resolve();
        }

        const tasks = [];
        for (let node, i = 0; node = nodes[i++];) {
            const task = this.entityParser.getObjects(node)
            .then(objects => {
                Object.keys(objects).forEach(key => {
                    context.entities.set(key, objects[key]);
                });
            });
            tasks.push(task);
        }

        return Promise.all(tasks);
    }

    _parseSequences(node, {scene}) {
        const sequencesNode = children(node, 'sequences')[0];
        if (sequencesNode) {
            const seq = scene.sequencer;
            this.sequenceParser.getSequences(sequencesNode).forEach(item => {
                seq.addSequence(item.id, item.sequence);
            });
        }
    }
}

module.exports = SceneParser;
