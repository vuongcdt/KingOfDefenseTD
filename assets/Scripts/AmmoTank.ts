import { _decorator, Collider2D, IPhysics2DContact } from 'cc';
import { Ammo } from './Ammo';
import { TowerPlacement } from './TowerPlacement';
const { ccclass, property } = _decorator;

@ccclass('AmmoTank')
export class AmmoTank extends Ammo {
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let target = otherCollider.node.getParent().getComponent(TowerPlacement);

        if (target) {
            target.setHP(this._damage);
        }
    }
}


