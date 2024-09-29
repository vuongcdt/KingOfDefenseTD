import { _decorator, Component, Label, ProgressBar, Sprite } from 'cc';
import { BaseUIComponent } from './BaseUIComponent';
import { GameState } from '../Enums';
const { ccclass, property } = _decorator;

@ccclass('LoadingScreen')
export class LoadingScreen extends BaseUIComponent {
    @property(ProgressBar)
    private progressBar: ProgressBar;
    @property(Label)
    private progressText: Label;

    private _count: number = 0;
    private _time: number = 0;


    start() {
        super.start();
        this._store.gameState = GameState.LoadingGame;
        this.setSlider();
    }

    setSlider() {
        this.progressBar.progress = 0;
        this.progressText.string = '0%';

        this._time = setInterval(() => {
            if (this._count > 100) {
                clearInterval(this._time);
                this.hideNode();
                return;
            }
            this._count++;
            this.progressBar.progress = this._count / 100;
            this.progressText.string = `${this._count}%`;
        }, 10);
    }


    update(deltaTime: number) {

    }
}


