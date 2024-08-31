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
    @property(Node)
    private avatar: Node;

    private _levelManager: LevelManager;
    private _currentHealth: number;
    private _damage: number;
    private _paths: Vec3[] = [];
    private tweenMove: Tween<Node>[] = []
    private _health: number = 10;

    public set levelManager(value: LevelManager) {
        this._levelManager = value;
    }

    init(path: Vec3[]) {
        this._paths = [];
        this._paths.push(...path);

        let currentPos = this.node.position;

        this._paths.forEach((point, index) => {
            const timeMove = this.getTimeMove(index == 0 ? this.node.position : this._paths[index - 1], point);

            this.tweenMove.push(tween(this.node)
                .call(() => {
                    this.setRotationAvatar(currentPos, point);
                    currentPos = point;
                })
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

    setRotationAvatar(currentPos: Vec3, newPos: Vec3) {
        let diff = new Vec3();
        Vec3.subtract(diff, currentPos, newPos);
        const angle = 270 - Math.atan2(diff.x, diff.y) * (180 / Math.PI);

        this.node.angle = angle;
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


