import { _decorator, Collider2D, Component, Contact2DType, game, IPhysics2DContact } from "cc";
import { Enemy } from "./Enemy";
import Store from "./Store";
const { ccclass, property } = _decorator;

@ccclass('Target')
export class Target extends Component {
    private _countEnemy: number = 20;

    protected start(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node.getComponent(Enemy);
        if (!enemy) {
            return;
        }

        this._countEnemy--;
        Store.getInstance().getGameManager().setHeartText();

        if (this._countEnemy == 0) {
            console.log("GAME OVER");
        }

    }

}


