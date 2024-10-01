import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
import { Enemy } from './Enemy';
import { eventTarget } from '../Common';
import { PLAY_AMMO_SOUND, PLAY_EXPLOSION_SOUND } from '../CONSTANTS';
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

    init(target: Vec3, speed: number, damage: number, angleShoot: number, levelTower: number) {
        eventTarget.emit(PLAY_AMMO_SOUND);
        this._damage = damage;
        this.node.angle = angleShoot;
        this._collider = this.getComponent(Collider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

        this.getComponent(Sprite).spriteFrame = this.bodySprites[levelTower];

        tween(this.node).to(this.getTimeMove(target) / speed, { position: target })
            .removeSelf()
            .start();
    }

    getTimeMove(target: Vec3): number {
        const distance = Vec3.distance(target, this.node.position);
        return distance / 500;
    }

    initWithRocket(target: Node, speed: number, damage: number, angleShoot: number, levelTower: number) {

    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const target = otherCollider.node.getComponent(Enemy);
        
        if (!target) {
            return;
        }

        tween(this.node).removeSelf().start();

        target.setHP(this._damage);
    }
}


