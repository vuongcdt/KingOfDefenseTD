import { _decorator, CircleCollider2D, Component, Enum, Node, RigidBody2D, Sprite, SpriteFrame, Tween, tween, UITransform, Vec3 } from "cc";
import { LevelManager } from "./LevelManager";
import { eventTarget } from "../Common";
import { ADD_COINT, CHECK_GAME_WIN, SET_WAVES } from "../CONSTANTS";
import { CharacterType } from "../Enums";
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
    protected _collider: CircleCollider2D;
    protected _rigibody: RigidBody2D;

    init(path: Vec3[], levelManage: LevelManager, indexPos: number, time: number, indexWave: number) {
        this._levelManage = levelManage;
        this._currentHealth = this.health;
        this.healthBar.active = false;
        this._paths = [];
        this._paths.push(...path);
        this.avatar.getComponent(Sprite).spriteFrame = this.avatarSprites;

        this._currentPos = this.node.position;
        this.avatar.angle = 180;

        this._collider = this.getComponent(CircleCollider2D);
        this._rigibody = this.getComponent(RigidBody2D);

        this.setPhysic(false);

        this._paths.forEach((point, index) => {
            const startPoint = index == 0 ? this.node.position : this._paths[index - 1];
            const timeMove = this.getTimeMove(startPoint, point);

            const position = new Vec3(point.x + Math.abs(indexPos) * this._offset - 30, point.y - indexPos * this._offset);

            const nodeTween = tween(this.node)
                .delay(index == 0 ? time : 0)
                .call(() => {
                    if (index == 0) {
                        this.setPhysic(true);
                        eventTarget.emit(SET_WAVES, indexWave);
                    }
                })
                .to(timeMove, { position: position });

            const avatarTween = tween(this.avatar)
                .delay(index == 0 ? time : 0)
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
    }

    setPhysic(isActice: boolean) {
        this._rigibody.enabled = isActice;
        this._collider.enabled = isActice;
    }

    getAngleAvatar(currentPos: Vec3, newPos: Vec3): number {
        const diff = new Vec3();
        Vec3.subtract(diff, currentPos, newPos);
        const angle = 270 - Math.atan2(diff.x, diff.y) * (180 / Math.PI);

        this._currentPos = newPos;
        return angle;
    }

    getTimeMove(start: Vec3, end: Vec3): number {
        return Vec3.distance(start, end) / 50 / this._speed;
    }

    setHP(damage: number) {
        this._currentHealth -= damage;

        this.healthBar.active = true;
        this.healthBar.getComponentInChildren(Sprite).fillRange = this._currentHealth / this.health;

        if (this._currentHealth <= 0) {
            tween(this.node).removeSelf().start();
            
            // this._levelManage.checkGameWin();
            eventTarget.emit(CHECK_GAME_WIN);
            eventTarget.emit(ADD_COINT, 100);
        }
    }

}


