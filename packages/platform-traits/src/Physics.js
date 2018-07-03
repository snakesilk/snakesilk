const {Vector3} = require('three');
const {Trait, Util: {readOnly}} = require('@snakesilk/engine');

class Physics extends Trait
{
    constructor()
    {
        super();

        this.NAME = 'physics';

        this.area = 0.04;
        this.atmosphericDensity = 1.225;
        this.dragCoefficient = .045;
        this.mass = 0;

        readOnly(this, {
            acceleration: new Vector3(),
            accelerationDelta: new Vector3(),
            force: new Vector3(),
            drag: new Vector3(),
            velocity: new Vector3(),
        });
    }
    __obstruct(object, attack)
    {
        if (attack === object.SURFACE_TOP) {
            this.velocity.copy(object.velocity);
        } else if (attack === object.SURFACE_BOTTOM) {
            this.velocity.y = object.velocity.y;
        } else if (attack === object.SURFACE_LEFT ||
                   attack === object.SURFACE_RIGHT) {
            this._host.velocity.x = object.velocity.x;
        }
    }
    __timeshift(dt)
    {
        if (this._enabled === false || this.mass <= 0) {
            return;
        }

        const
            g = this._host.world.gravityForce,
            v = this.velocity,
            a = this.acceleration,
            å = this.accelerationDelta,
            F = this.force,
            m = this.mass;

        F.sub(g).multiplyScalar(m);

        const Fd = this._calculateDrag();
        F.add(Fd);
        //console.log("Force: %f,%f, Resistance: %f,%f, Result: %f,%f", F.x, F.y, Fd.x, Fd.y, F.x - Fd.x, F.y - Fd.y);

        å.copy(F).divideScalar(m);
        a.copy(å);
        v.add(a);

        this._host.velocity.copy(v);

        F.set(0, 0, 0);
    }
    _calculateDrag()
    {
        const
            ρ = this.atmosphericDensity,
            Cd = this.dragCoefficient,
            A = this.area,
            v = this._host.velocity;
        /* abs value for one velocity component to circumvent
           signage removal on v^2 . */
        this.drag.x = -.5 * ρ * Cd * A * v.x * Math.abs(v.x);
        this.drag.y = -.5 * ρ * Cd * A * v.y * Math.abs(v.y);
        this.drag.z = -.5 * ρ * Cd * A * v.z * Math.abs(v.z);
        return this.drag;
    }
    bump(x, y)
    {
        this.velocity.x += x;
        this.velocity.y += y;
    }
    reset()
    {
        this.zero();
    }
    zero()
    {
        this.velocity.set(0, 0, 0);
        this._host.velocity.copy(this.velocity);
        this._host.integrator.reset();
    }
}

module.exports = Physics;
