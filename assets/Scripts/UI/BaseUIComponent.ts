import { _decorator } from 'cc';
import { BaseComponent } from '../BaseComponent';
import { eventTarget } from '../Events';
import { HIDE_POPUP, PAUSE_GAME, UN_PAUSE_GAME } from '../CONSTANTS';
import { GameState } from '../Enums';
const { ccclass, property } = _decorator;

@ccclass('BaseUIComponent')
export class BaseUIComponent extends BaseComponent {
    start() {
        super.start();
    }

    update(deltaTime: number) {

    }

    showNode() {
        eventTarget.emit(HIDE_POPUP);
        eventTarget.emit(PAUSE_GAME);
        this._store.gameState = GameState.PauseGame;
        this.node.parent = this._store.canvas;
    }

    hideNode() {
        this.node.parent = null;
        this._store.gameState = GameState.PlayGame;
        eventTarget.emit(UN_PAUSE_GAME);
    }
}


