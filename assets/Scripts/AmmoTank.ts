import { _decorator, Collider2D, Component, game, IPhysics2DContact, Node, tween } from 'cc';
import { Ammo } from './Ammo';
import { TowerPlacement } from './TowerPlacement';
const { ccclass, property } = _decorator;

@ccclass('AmmoTank')
export class AmmoTank extends Ammo {
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let target = otherCollider.node.getParent().getComponent(TowerPlacement);

        if (target) {
            // tween(this.node).removeSelf().start();
            target.setHP(3);
            // target.setHP(this._damage);
        }
    }
}


