const {Vector3} = require('three');
const {Trait} = require('@snakesilk/engine');

class Spawn extends Trait
{
    constructor()
    {
        super();
        this.NAME = 'spawn';

        this._conditions = [];

        this._bind = this._bind.bind(this);
        this._unbind = this._unbind.bind(this);
    }
    __attach()
    {
        super.__attach.apply(this, arguments);
        this._conditions.forEach(this._bind);
    }
    __detach()
    {
        this._conditions.forEach(this._unbind);
        super.__detach.apply(this, arguments);
    }
    _bind(condition)
    {
        this._host.events.bind(condition.event, condition.callback);
    }
    _unbind(condition)
    {
        this._host.events.unbind(condition.event, condition.callback);
    }
    addItem(event, constr, offset = new Vector3())
    {
        this._conditions.push({
            event: event,
            callback: function dispatchSpawn() {
                const object = new constr();
                object.position.copy(this.position);
                object.position.add(offset);
                this.world.addObject(object);
            },
        });
    }
}

module.exports = Spawn;
