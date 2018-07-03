const Light = require('./Light');

class Glow extends Light
{
    constructor()
    {
        super();
        this.NAME = 'glow';
    }
}

module.exports = Glow;
