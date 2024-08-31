import { _decorator, Collider2D, Component, Contact2DType, game, Game, IPhysics2DContact, Node, PhysicsSystem2D, Quat, tween, Vec3 } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('Ammo')
export class Ammo extends Component {
    private _damage: number;

    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        // if (PhysicsSystem2D.instance) {
        //     PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        // }
    }

    update(deltaTime: number) {

    }

    init(target: Vec3, speed: number, damage: number, angleShoot: number) {

        this._damage = damage;
        this.node.angle = angleShoot;

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


