import { _decorator, Component, game, Node, Quat, Vec2, Vec3, } from 'cc';
import { GameState } from './Enums';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    private gameoverPopup: Node;

    private _gameState: GameState = GameState.PlayGame;
    private _enemyNum: number = 3;

    public get gameState(): number {
        return this._gameState;
    }

    public set gameState(value: number) {
        this._gameState = value;
    }

    checkGameOver() {
        console.log('checkGameOver');
        // this._enemyNum--;
        // if (this._enemyNum <= 0) {
        //     game.pause();
        //     this._gameState = GameState.OverGame;
        //     this.gameoverPopup.active = true;
        // }
    }

    onReplayGame(){
        game.run();
        this.gameoverPopup.active = false;
    }

    start() {
        
    }

    update(deltaTime: number) {

    }
}


