import { Enemy } from './Enemy';

export  abstract class Attack {
    private _speed: number;
    private _reloadShoot: number;
    private _target: Enemy | null;

    get speed() {
        return this._speed
    }

    set speed(val: number) {
        this._speed = val
    }

    get reloadShoot() {
        return this._reloadShoot
    }

    set reloadShoot(val: number) {
        this._reloadShoot = val
    }

    get target() {
        return this._target
    }

    set target(val: Enemy | null) {
        this._target = val
    }

    shoot() {

    }

}


