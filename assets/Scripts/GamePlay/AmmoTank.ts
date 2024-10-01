import { _decorator, BoxCollider2D, Collider2D, game, IPhysics2DContact } from 'cc';
import { Ammo } from './Ammo';
import { TowerPlacement } from './TowerPlacement';
const { ccclass, property } = _decorator;

@ccclass('AmmoTank')
export class AmmoTank extends Ammo {
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let tower = otherCollider.node.getParent().getComponent(TowerPlacement);
        if (otherCollider instanceof BoxCollider2D && tower){
            tower.setHP(this._damage);
        }
    }
}


