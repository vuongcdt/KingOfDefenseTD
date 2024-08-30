import { _decorator, Component, Node, Sprite, Tween, tween, Vec3 } from "cc";
import { LevelManager } from "./LevelManager";
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    @property(Node)
    private canvas: Node;
    @property
    private speed: number = 1;

    private _levelManager: LevelManager;
    private _health: number = 10;
    private _damage: number;
    private _avatar: Sprite;
    private _paths: Vec3[] = [];
    private tweenMove: Tween<Node>[] = []

    public set levelManager(value: LevelManager) {
        this._levelManager = value;
    }

    init(path: Vec3[]) {
        this._paths = [];
        this._paths.push(...path);

        this._paths.forEach((point, index) => {
            const timeMove = this.getTimeMove(index == 0 ? this.node.position : this._paths[index - 1], point);

            this.tweenMove.push(tween(this.node).to(timeMove, {
                position: point
            }))
        });

        tween(this.node).sequence(...this.tweenMove).start()
    }

    getTimeMove(start: Vec3, end: Vec3) {
        return Vec3.distance(start, end) / 100 * this.speed;
    }

    setHP(damage: number) {
        this._health -= damage;

        
        if (this._health<0) {
            this._levelManager.removeEnemy(this.node);
            tween(this.node).removeSelf().start();
        }
    }

    start(): void {

    }
    update(dt: number): void {

    }

}


