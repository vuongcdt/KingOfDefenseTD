
export abstract  class Target {


    get health() {
        return this._health
    }

    set health(val: number) {
        this._health = val
    }
    private _health: number;

    setHp() {

    }


}


