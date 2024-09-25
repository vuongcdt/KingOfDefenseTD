import { _decorator, Button, Component, game, Node, RichText } from 'cc';
import { GameState } from './Enums';
import Store from './Store';
import { eventTarget } from './Events';
import { SUB_COINT, ADD_COINT, SET_HEART } from './CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    private gameoverPopup: Node;
    @property(RichText)
    private coinText: RichText;
    @property(RichText)
    private wavesText: RichText;
    @property(RichText)
    private heartText: RichText;
    @property(RichText)
    private levelText: RichText;
    @property(Node)
    private settingPopup: Node;
    @property(Node)
    private homeScreen: Node;

    private _store: Store;

    onLoad() {
        eventTarget.on(SUB_COINT, this.subCoint, this);
        eventTarget.on(ADD_COINT, this.addCoint, this);
        eventTarget.on(SET_HEART, this.setHeart, this);
    }

    start() {
        this._store = Store.getInstance();
        this.setHeartText();
    }

    update(deltaTime: number) {

    }

    addCoint(cost: number) {
        this._store.coinTotal += cost;
        this.setCoinText();
    }

    subCoint(cost: number) {
        this._store.coinTotal -= cost;
        this.setCoinText();
    }

    checkGameOver() {
        this._store.heart--;
        if (this._store.heart <= 0) {
            game.pause();
            this._store.gameState = GameState.OverGame;
            this.gameoverPopup.active = true;
        }
    }

    onReplayGame() {
        game.run();
        this.gameoverPopup.active = false;
    }

    setCoinText() {
        this.coinText.string = this._store.coinTotal.toString();
    }

    setWavesText(value: string) {
        this.wavesText.string = value;
    }

    setHeart() {
        --this._store.heart;
        this.setHeartText();
    }

    setHeartText() {
        this.heartText.string = this._store.heart.toString();
    }

    setLevelText(value: number) {
        this._store.level = value;
        this.levelText.string = this._store.level.toString();
    }

    onLevelClicked(e: Event, customEventData: string) {
        this.homeScreen.active = false;
    }

    onSettingClicked() {
        this.settingPopup.active = true;
    }

    onSpeedClicked() {

    }

}


