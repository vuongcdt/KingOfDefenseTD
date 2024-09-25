import { _decorator, Component, Label, Node } from 'cc';
import Store from '../Store';
import { eventTarget } from '../Events';
import { SET_COINT_TEXT, SET_HEART_TEXT, SET_LEVEL_TEXT, SET_WAVES_TEXT } from '../CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    @property(Node)
    private gameoverPopup: Node;
    @property(Label)
    private coinText: Label;
    @property(Label)
    private wavesText: Label;
    @property(Label)
    private heartText: Label;
    @property(Label)
    private levelText: Label;
    @property(Node)
    private settingPopup: Node;
    @property(Node)
    private homeScreen: Node;

    private _store: Store;

    protected onLoad(): void {
        eventTarget.on(SET_COINT_TEXT, this.setCoinText, this);
        eventTarget.on(SET_HEART_TEXT, this.setHeartText, this);
        eventTarget.on(SET_LEVEL_TEXT, this.setLevelText, this);
        eventTarget.on(SET_WAVES_TEXT, this.setWavesText, this);
    }


    start() {
        this._store = Store.getInstance();
        this.setCoinText();
        this.setHeartText();
        this.setLevelText();
        this.setWavesText();
    }

    update(deltaTime: number) {

    }

    setCoinText() {
        this.coinText.string = this._store.coinTotal.toString();
    }

    setWavesText() {
        this.wavesText.string = `Waves ${this._store.waves}/9`;
    }

    setHeartText() {
        this.heartText.string = this._store.heart.toString();
    }

    setLevelText() {
        this.levelText.string = this._store.level.toString();
    }
}


