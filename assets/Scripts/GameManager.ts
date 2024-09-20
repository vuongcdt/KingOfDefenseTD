import { _decorator, Component, game, Node, RichText } from 'cc';
import { GameState } from './Enums';
import Store from './Store';
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

    private _gameState: GameState = GameState.PlayGame;
    private _heart: number = 20;
    private _coinTotal: number =1000;
    private _waves: number =9;
    private _level: number =1;

    public get gameState(): number {
        return this._gameState;
    }

    public set gameState(value: number) {
        this._gameState = value;
    }

    checkGameOver() {
        this._heart--;
        if (this._heart <= 0) {
            game.pause();
            this._gameState = GameState.OverGame;
            this.gameoverPopup.active = true;
        }
    }

    onReplayGame() {
        game.run();
        this.gameoverPopup.active = false;
    }

    setCoinText(value: number) {
        console.log(value);
        
        this._coinTotal -= value;
        this.coinText.string = this._coinTotal.toString();
    }

    setWavesText(value: string) {
        this.wavesText.string = value;
    }

    setHeartText() {
        this.heartText.string = (--this._heart).toString();
    }

    setLevelText(value: number) {
        this._level = value;
        this.levelText.string = this._level.toString();
    }

    start() {
        Store.getInstance().setGameManager(this);
    }

    update(deltaTime: number) {

    }
}


