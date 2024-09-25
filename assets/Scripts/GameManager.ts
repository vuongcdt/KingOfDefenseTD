import { _decorator, Button, Component, game, Node, RichText, Tween } from 'cc';
import { GameState } from './Enums';
import Store from './Store';
import { eventTarget } from './Events';
import { SUB_COINT, ADD_COINT, SET_HEART, SET_HEART_TEXT, SET_COINT_TEXT as SET_COIN_TEXT, SET_LEVEL_TEXT } from './CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    private gameoverPopup: Node;
    @property(Node)
    private settingPopup: Node;

    private _store: Store;

    onLoad() {
        eventTarget.on(SUB_COINT, this.subCoint, this);
        eventTarget.on(ADD_COINT, this.addCoint, this);
        eventTarget.on(SET_HEART, this.setHeart, this);
    }

    start() {
        this._store = Store.getInstance();
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
            this.gameoverPopup.active = true;
        }
    }

    setLevel(value: number) {
        this._store.level = value;
        eventTarget.emit(SET_LEVEL_TEXT);
    }

    onSettingClicked() {
        this.settingPopup.active = true;
    }

    onSpeedClicked() {

    }

}


