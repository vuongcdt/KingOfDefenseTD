import { _decorator, Canvas, Component, find, Node, Sprite, Tween, tween, Vec3 } from "cc";
import { LevelManager } from "./LevelManager";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    @property(Node)
    private healthBar: Node;
    @property
    private speed: number = 1;


    private _levelManager: LevelManager;
    private _currentHealth: number;
    private _damage: number;
    private _avatar: Sprite;
    private _paths: Vec3[] = [];
    private tweenMove: Tween<Node>[] = []
    private _health: number = 10;

    public set levelManager(value: LevelManager) {
        this._levelManager = value;
    }

    init(path: Vec3[]) {
        this._paths = [];
        this._paths.push(...path);

        this._paths.forEach((point, index) => {
            const timeMove = this.getTimeMove(index == 0 ? this.node.position : this._paths[index - 1], point);

            this.tweenMove.push(tween(this.node)
                .to(timeMove, { position: point })
            )
        });

        tween(this.node)
            .sequence(...this.tweenMove)
            .removeSelf()
            .call(this.checkkGameOver)
            .start();

        this._currentHealth = this._health;
    }

    checkkGameOver() {
        const canvas = find("Canvas");

        const gameManager = canvas.getComponentInChildren(GameManager);

        gameManager.checkGameOver();
    }

    getTimeMove(start: Vec3, end: Vec3) {
        return Vec3.distance(start, end) / 100 * this.speed;
    }

    setHP(damage: number) {
        this._currentHealth -= damage;

        this.healthBar.active = true;
        this.healthBar.getComponentInChildren(Sprite).fillRange = this._currentHealth / this._health;

        if (this._currentHealth <= 0) {
            this._levelManager.removeEnemy(this.node);
            tween(this.node).removeSelf().start();
        }
    }

    start(): void {

    }

    update(dt: number): void {

    }

}


