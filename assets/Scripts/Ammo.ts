import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, PhysicsSystem2D, Quat, tween, Vec3 } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('Ammo')
export class Ammo extends Component {
    private _damage: number;

    start() {
        let collider = this.getComponent(Collider2D);

        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

    }

    update(deltaTime: number) {

    }

    init(target: Vec3, speed: number, damage: number) {
        this._damage = damage;
        
        tween(this.node).to(speed, { angle: 90, position: target }).start();
        // this.node.angle = 

        // setTimeout(() => {
        //     if (this.node.parent) { this.node.parent = null; }
        // }, 1000);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when two colliders begin to contact
        // console.log('onBeginContact',selfCollider,otherCollider,contact);
        // console.log("otherCollider", otherCollider);

        // const enemy = otherCollider.node.getComponent(Enemy);
        // enemy.setHP(this._damage);

        tween(this.node).delay(0.1).removeSelf().start();
    }
}


