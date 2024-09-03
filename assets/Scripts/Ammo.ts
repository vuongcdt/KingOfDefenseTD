import { _decorator, Collider2D, Component, Contact2DType, game, Game, IPhysics2DContact, Node, PhysicsSystem2D, Quat, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('Ammo')
export class Ammo extends Component {
    @property([SpriteFrame])
    private bodySprites: SpriteFrame[] = [];
    @property([SpriteFrame])
    private rocketTailSprites: SpriteFrame[] = [];

    private _damage: number;

    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update(deltaTime: number) {

    }

    init(target: Vec3, speed: number, damage: number, angleShoot: number, levelTower: number) {
        this._damage = damage;
        this.node.angle = angleShoot;

        this.getComponent(Sprite).spriteFrame = this.bodySprites[levelTower];
        this.getComponentInChildren(Sprite).spriteFrame = this.rocketTailSprites[levelTower];

        tween(this.node).to(speed, { position: target })
            .removeSelf()
            .start();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node.getComponent(Enemy);

        if (enemy) {
            tween(this.node).removeSelf().start();
            enemy.setHP(this._damage);
        }
    }
}


