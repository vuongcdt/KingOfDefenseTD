import { _decorator, Component, Node, Tween } from 'cc';
import { GameState } from './Enums';
import Store from './Store';
import { eventTarget } from './Events';
import { SUB_COINT, ADD_COINT, SET_HEART, SET_HEART_TEXT, SET_COINT_TEXT as SET_COIN_TEXT, SET_LEVEL_TEXT, SHOW_GAMEOVER_POPUP, RESET_GAMELAY_UI, RESET_GAME, HIDE_POPUP } from './CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    private canvas: Node;

    private _store: Store;

    onLoad() {
        eventTarget.on(SUB_COINT, this.subCoint, this);
        eventTarget.on(ADD_COINT, this.addCoint, this);
        eventTarget.on(SET_HEART, this.setHeart, this);
        eventTarget.on(RESET_GAME, this.resetGame, this);
    }

    start() {
        this._store = Store.getInstance();
        this._store.canvas = this.canvas;
    }

    update(deltaTime: number) {

    }

    addCoint(cost: number) {
        this._store.coinTotal += cost;
        eventTarget.emit(SET_COIN_TEXT);
    }

    subCoint(cost: number) {
        this._store.coinTotal -= cost;
        eventTarget.emit(SET_COIN_TEXT);
    }

    setHeart() {
        --this._store.heart;
        eventTarget.emit(SET_HEART_TEXT);

        if (this._store.heart <= 0) {
            Tween.stopAll();
            this._store.gameState = GameState.OverGame;
            eventTarget.emit(SHOW_GAMEOVER_POPUP);
        }
    }

    setLevel(value: number) {
        this._store.level = value;
        eventTarget.emit(SET_LEVEL_TEXT);
    }

    resetGame() {
        this._store.coinTotal = 1000;
        this._store.heart = 3;
        this._store.waves = 1;
        eventTarget.emit(RESET_GAMELAY_UI);
        eventTarget.emit(HIDE_POPUP);
    }

}


