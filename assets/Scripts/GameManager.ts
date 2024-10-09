import { _decorator, Component, director, game, Graphics, Node, Tween } from 'cc';
import { GameState } from './Enums';
import Store from './Store';
import { eventTarget } from './Common';
import { SUB_COINT, ADD_COINT, SET_HEART, SET_HEART_TEXT, SET_COINT_TEXT as SET_COIN_TEXT, SET_LEVEL_TEXT, SHOW_GAME_OVER_POPUP, RESET_GAMELAY_UI, RESET_GAME, HIDE_POPUP, PAUSE_GAME, UN_PAUSE_GAME, SET_WAVES, SET_WAVES_TEXT, SHOW_GAME_WIN_POPUP, CHECK_GAME_WIN } from './CONSTANTS';
import { Enemy } from './GamePlay/Enemy';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    private canvas: Node;
    @property(Node)
    private enemyLayer: Node = null;
    @property(Node)
    private ammoLayer: Node = null;
    @property(Node)
    private towerLayer: Node = null;
    @property(Node)
    private homeScreen: Node = null;

    private _store: Store;

    onLoad() {
        eventTarget.on(SUB_COINT, this.subCoint, this);
        eventTarget.on(ADD_COINT, this.addCoint, this);
        eventTarget.on(SET_HEART, this.setHeart, this);
        eventTarget.on(SET_WAVES, this.setWave, this);
        eventTarget.on(RESET_GAME, this.resetGame, this);
        eventTarget.on(PAUSE_GAME, this.pauseGame, this);
        eventTarget.on(UN_PAUSE_GAME, this.unPauseGame, this);
        eventTarget.on(CHECK_GAME_WIN, this.checkGameWin, this);
    }

    start() {
        this._store = Store.getInstance();
        this._store.graphics = this.getComponent(Graphics);
        this._store.ammoLayer = this.ammoLayer;
        this._store.towerLayer = this.towerLayer;
        this._store.canvas = this.canvas;

        this._store.levelMax = Number(localStorage.getItem('levelMax'));
        this.homeScreen.active = true;
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
        this._store.heart--;
        eventTarget.emit(SET_HEART_TEXT);
        this.checkGameWin();

        if (this._store.heart <= 0) {
            Tween.stopAll();
            this._store.gameState = GameState.OverGame;
            eventTarget.emit(SHOW_GAME_OVER_POPUP);
        }
    }

    setWave(value: number) {
        this._store.waves = value;
        eventTarget.emit(SET_WAVES_TEXT);
    }

    setLevel(value: number) {
        this._store.levelPlaying = value;
        eventTarget.emit(SET_LEVEL_TEXT);
    }

    resetGame() {
        this._store.coinTotal = 500;
        this._store.heart = 3;
        this._store.waves = 1;

        eventTarget.emit(RESET_GAMELAY_UI);
        eventTarget.emit(HIDE_POPUP);
    }

    pauseGame() {
        director.pause();
    }

    unPauseGame() {
        director.resume();
    }

    checkGameWin() {
        this.scheduleOnce(() => {
            const totalEnemy = this.enemyLayer.getComponentsInChildren(Enemy).length;

            if (totalEnemy == 0 && this._store.heart > 0) {
                console.log('GAME WIN');

                this.pauseGame();
                eventTarget.emit(SHOW_GAME_WIN_POPUP);
                if (this._store.levelPlaying == this._store.levelMax) {
                    this._store.levelMax++;
                    localStorage.setItem('levelMax',this._store.levelMax.toString());
                }
            }
        });
    }
}


