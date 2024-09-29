import { _decorator, Button, director, Label, Node } from 'cc';
import { eventTarget } from '../Common';
import { RESET_GAMELAY_UI, SET_COINT_TEXT, SET_HEART_TEXT, SET_LEVEL_TEXT, SET_WAVES_TEXT, SHOW_SETTING_POPUP, SPEED_CHANGE } from '../CONSTANTS';
import { BaseComponent } from '../BaseComponent';
const { ccclass, property } = _decorator;

@ccclass('GamePlayScreen')
export class GamePlayScreen extends BaseComponent {
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
    private settingBtn: Node;
    @property(Node)
    private speedBtn: Node;
    @property(Node)
    private homeScreen: Node;

    protected onLoad(): void {
        eventTarget.on(SET_COINT_TEXT, this.setCoinText, this);
        eventTarget.on(SET_HEART_TEXT, this.setHeartText, this);
        eventTarget.on(SET_LEVEL_TEXT, this.setLevelText, this);
        eventTarget.on(SET_WAVES_TEXT, this.setWavesText, this);
        eventTarget.on(RESET_GAMELAY_UI, this.resetGamePlayUI, this);
    }


    start() {
        super.start();

        this.settingBtn.on(Button.EventType.CLICK, this.showSettingPopup, this);
        this.speedBtn.on(Button.EventType.CLICK, this.onSpeedClick, this);

        this.resetGamePlayUI();
    }

    resetGamePlayUI() {
        this.setCoinText();
        this.setHeartText();
        this.setLevelText();
        this.setWavesText();
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

    showSettingPopup() {
        eventTarget.emit(SHOW_SETTING_POPUP);
    }

    onSpeedClick() {
        console.log('speed');
        // eventTarget.emit(SPEED_CHANGE,2);
        director.getScheduler().setTimeScale(2);
    }
}


