import { _decorator, Component, Enum, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from "cc";
import { LevelManager } from "./LevelManager";
import { eventTarget } from "./Common";
import { ADD_COINT } from "./CONSTANTS";
import { CharacterType } from "./Enums";
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    @property({ type: Enum(CharacterType) })
    public characterType: CharacterType = CharacterType.Soldier;
    
    @property(Node)
    protected healthBar: Node;
    @property(Node)
    protected avatar: Node;
    @property(SpriteFrame)
    protected avatarSprites: SpriteFrame;
    @property
    protected health: number = 14;

    protected _speed: number = 1;
    protected _damage: number;
    protected _paths: Vec3[] = [];
    protected tweenMove: Tween<Node>[] = [];
    protected tweenRotation: Tween<Node>[] = [];
    protected _currentHealth: number;
    protected _currentPos: Vec3;
    protected _levelManage: LevelManager;
    protected _offset: number = 30;

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
                .to(timeMove, { position: pos }, {
                    onUpdate(target, ratio) {

                    },
                });

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

        this._currentHealth = this.health;
    }

    getAngleAvatar(currentPos: Vec3, newPos: Vec3) {
        let diff = new Vec3();
        Vec3.subtract(diff, currentPos, newPos);
        const angle = 270 - Math.atan2(diff.x, diff.y) * (180 / Math.PI);

        this._currentPos = newPos;
        return angle;
    }

    getTimeMove(start: Vec3, end: Vec3) {
        return Vec3.distance(start, end) / 50 / this._speed;
    }

    setHP(damage: number) {
        this._currentHealth -= damage;

        this.healthBar.active = true;
        this.healthBar.getComponentInChildren(Sprite).fillRange = this._currentHealth / this.health;

        if (this._currentHealth <= 0) {
            tween(this.node).removeSelf().start();

            eventTarget.emit(ADD_COINT, 100);
        }
    }

}


