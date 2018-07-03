const {Trait} = require('@snakesilk/engine');
const {Translate} = require('@snakesilk/platform-traits');

class DeathRay extends Trait
{
    constructor()
    {
        super();

        this.NAME = 'deathray';
        this.pool = [];
    }

    __timeshift(dt)
    {

    }
}

module.exports = DeathRay;
