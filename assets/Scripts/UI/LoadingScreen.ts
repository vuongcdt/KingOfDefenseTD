import { _decorator, Component, Sprite } from 'cc';
import { BaseUIComponent } from './BaseUIComponent';
import { GameState } from '../Enums';
const { ccclass, property } = _decorator;

@ccclass('LoadingScreen')
export class LoadingScreen extends BaseUIComponent {
    @property(Sprite)
    private fill: Sprite;

    private _count: number = 0;
    private _time: number = 0;


    start() {
        super.start();
        this.setSlider();
        this._store.gameState = GameState.LoadingGame;
    }

    setSlider() {
        this.fill.fillRange = 0;
        this._time = setInterval(() => {
            if (this._count > 100) {
                clearInterval(this._time);
                this.hideNode();
                return;
            }
            this._count++;
            this.fill.fillRange = this._count / 100;
        }, 10);
    }


    update(deltaTime: number) {

    }
}


