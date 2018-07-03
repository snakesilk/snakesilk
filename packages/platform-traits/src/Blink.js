const {Trait} = require('@snakesilk/engine');

class Blink extends Trait
{
    constructor() {
        super();
        this.NAME = 'blink';
        this.interval = 1;
        this.ratio = 0.5;
        this._time = 0;
    }

    reset() {
        this._time = 0;
    }

    __timeshift(deltaTime) {
        this._time = this._time + deltaTime;
        this._host.model.visible = (this._time % this.interval) / this.interval < this.ratio;
    }
}

module.exports = Blink;
