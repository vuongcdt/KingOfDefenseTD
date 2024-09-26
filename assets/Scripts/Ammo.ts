import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('Ammo')
export class Ammo extends Component {
    @property([SpriteFrame])
    protected bodySprites: SpriteFrame[] = [];

    protected _damage: number;
    protected _tweenMove: Tween<Node>[] = [];
    protected _currentPos: Vec3 = Vec3.ZERO;
    protected _collider: Collider2D;
    protected _target: Node;
    protected _angleEnd: number = 0;
    protected _timeInterval: number = 0;

    start() {
        // this._collider = this.getComponent(Collider2D);
        // if (this._collider) {
        //     this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        // }
    }

    init(target: Vec3, speed: number, damage: number, angleShoot: number, levelTower: number) {
        this._damage = damage;
        this.node.angle = angleShoot;
        this._collider = this.getComponent(Collider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

        this.getComponent(Sprite).spriteFrame = this.bodySprites[levelTower];
        
        tween(this.node).to(speed, { position: target })
            .removeSelf()
            .start();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let target = otherCollider.node.getComponent(Enemy);

        if (!target) {
            return;
        }

        tween(this.node).removeSelf().start();

        target.setHP(this._damage);
    }
}


