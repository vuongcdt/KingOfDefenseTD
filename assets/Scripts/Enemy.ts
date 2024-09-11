import { _decorator,  Component, find, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from "cc";
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
    
    start(): void {
    }

    update(dt: number): void {

    }

    init(path: Vec3[], levelManage: LevelManager) {
        this._levelManage = levelManage;
        this.healthBar.active = false;
        this._paths = [];
        this._paths.push(...path);
        this.avatar.getComponent(Sprite).spriteFrame = this.avatarSprites;

        this._currentPos = this.node.position;
        this.avatar.angle = 180;

        this._paths.forEach((point, index) => {
            const timeMove = this.getTimeMove(index == 0 ? this.node.position : this._paths[index - 1], point);

            const t1 = tween(this.node).to(timeMove, { position: point });
            const t2 = tween(this.avatar)
                .to(0.2 * timeMove, { angle: this.getAngleAvatar(this._currentPos, point) })
                .delay(0.8 * timeMove);

            if (index == this._paths.length - 1) {
                t1.call(()=>this.checkGameOver());
            }

            this.tweenMove.push(t1);
            this.tweenRotation.push(t2);
        });


        tween(this.avatar)
            .sequence(...this.tweenRotation)
            .start();

        tween(this.node)
            .sequence(...this.tweenMove)
            // .call(this.checkGameOver)
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

    checkGameOver() {
        console.log('checkGameOver');
        return;

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
            tween(this.node).removeSelf().start();
        }
    }
}


