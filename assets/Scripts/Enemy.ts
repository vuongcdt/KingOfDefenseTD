import { _decorator, Component, find, Node, randomRange, randomRangeInt, Sprite, SpriteFrame, Tween, tween, Vec3 } from "cc";
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
    @property(SpriteFrame)
    private avatarSprites: SpriteFrame;

    private _damage: number;
    private _paths: Vec3[] = [];
    private tweenMove: Tween<Node>[] = [];
    private tweenRotation: Tween<Node>[] = [];
    private _health: number = 10;
    private _currentHealth: number;
    private _currentPos: Vec3;
    private _levelManage: LevelManager;
    protected _offset: number = 40;

    start(): void {
    }

    update(dt: number): void {
    }

    init(path: Vec3[], levelManage: LevelManager, indexPos: number) {
        this._levelManage = levelManage;
        this.healthBar.active = false;
        this._paths = [];
        this._paths.push(...path);
        this.avatar.getComponent(Sprite).spriteFrame = this.avatarSprites;

        this._currentPos = this.node.position;
        this.avatar.angle = 180;

        this._paths.forEach((point, index) => {
            const timeMove = this.getTimeMove(index == 0 ? this.node.position : this._paths[index - 1], point);
            let pos = Vec3.ZERO;

            pos = new Vec3(point.x + Math.abs(indexPos) * this._offset, point.y - indexPos * this._offset);

            const nodeTween = tween(this.node)
                .to(timeMove, { position: pos });

            const avatarTween = tween(this.avatar)
                .to(1, { angle: this.getAngleAvatar(this._currentPos, point) })
                .delay(timeMove - 1);

            this.tweenMove.push(nodeTween);
            this.tweenRotation.push(avatarTween);
        });


        tween(this.avatar)
            .sequence(...this.tweenRotation)
            .start();

        tween(this.node)
            .sequence(...this.tweenMove)
            .removeSelf()
            .start();

        this._currentHealth = this._health;
    }

    getAngleAvatar(currentPos: Vec3, newPos: Vec3) {
        let diff = new Vec3();
        Vec3.subtract(diff, currentPos, newPos);
        const angle = 270 - Math.atan2(diff.x, diff.y) * (180 / Math.PI);

        this._currentPos = newPos;
        return angle;
    }

    // checkGameOver() {
    //     console.log('checkGameOver');
    //     return;

    //     const canvas = find("Canvas");

    //     const gameManager = canvas.getComponentInChildren(GameManager);

    //     gameManager.checkGameOver();
    // }

    getTimeMove(start: Vec3, end: Vec3) {
        return Vec3.distance(start, end) / 100 * this.speed;
    }

    setHP(damage: number) {
        this._currentHealth -= damage;

        this.healthBar.active = true;
        this.healthBar.getComponentInChildren(Sprite).fillRange = this._currentHealth / this._health;

        if (this._currentHealth <= 0) {
            tween(this.node).removeSelf().start();
        }
    }
}


