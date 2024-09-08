import { _decorator, Collider2D, Component, Contact2DType, game, Game, IPhysics2DContact, Node, PhysicsSystem2D, Quat, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { Enemy } from './Enemy';
import { TowerType } from './Enums';
import { Turent } from './Turent';
const { ccclass, property } = _decorator;

@ccclass('Ammo')
export class Ammo extends Component {
    @property([SpriteFrame])
    private bodySprites: SpriteFrame[] = [];
    @property([SpriteFrame])
    private rocketTailSprites: SpriteFrame[] = [];

    private _damage: number;
    private _targetName: string;

    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update(deltaTime: number) {

    }

    init(target: Vec3, targetName: string, speed: number, damage: number, angleShoot: number, levelTower: number) {
        this._damage = damage;
        this.node.angle = angleShoot;
        this._targetName = targetName;

        this.getComponent(Sprite).spriteFrame = this.bodySprites[levelTower];
        this.getComponentInChildren(Sprite).spriteFrame = this.rocketTailSprites[levelTower];

        tween(this.node).to(speed, { position: target })
            .removeSelf()
            .start();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this._targetName == TowerType[TowerType.Tank]) {
            const target = otherCollider.node.getComponent(Enemy);

            if (!target) {
                return;
            }
            tween(this.node).removeSelf().start();
            target.setHP(this._damage);
        } else {
            // const target = otherCollider.node.getComponent(Turent);
            // if (target) {
            //     tween(this.node).removeSelf().start();
            //     target.setHP(this._damage);
            // }
        }

    }
}


