import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingScreen')
export class LoadingScreen extends Component {
    @property(Sprite)
    private fill: Sprite;

    private _count: number = 0;
    private _time: number = 0;


    start() {
        this.fill.fillRange = 0;
        this._time = setInterval(() => {
            if (this._count > 100) {
                clearInterval(this._time);
                this.node.active = false;
                return;
            }
            this._count++;
            this.fill.fillRange = this._count / 100;
        }, 10);
    }

    update(deltaTime: number) {

    }
}


