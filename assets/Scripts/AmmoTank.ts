import { _decorator, Collider2D, Component, IPhysics2DContact, Node, tween } from 'cc';
import { Ammo } from './Ammo';
import { Enemy } from './Enemy';
import { TowerPlacement } from './TowerPlacement';
import { Turent } from './Turent';
const { ccclass, property } = _decorator;

@ccclass('AmmoTank')
export class AmmoTank extends Ammo {
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let target = otherCollider.node.getParent().getComponent(TowerPlacement);
        tween(this.node).removeSelf().start();

        console.log(this._damage);
        
        target.setHP(3);
        // target.setHP(this._damage);
    }
}


