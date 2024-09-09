import { _decorator, Vec3 } from "cc";
import { TowerType } from "./Enums";
import { Turent } from "./Turent";
const { ccclass } = _decorator;

@ccclass('TurrentTank')
export class TurrentTank extends Turent {

    setAngleShoot() {
        this._diffTowerToTarget = new Vec3();
        Vec3.subtract(this._diffTowerToTarget, this.node.getParent().position, this._listEnemy[0].position);

        this._angleShoot = -90 - Math.atan2(this._diffTowerToTarget.x, this._diffTowerToTarget.y) * (180 / Math.PI);
    }

    attackEnemy() {
        if (!this._target) {
            this._target = this._listEnemy[0];
        }

        this.shooting();

        var normalize = this._diffTowerToTarget.normalize();
        normalize.multiplyScalar(this.muzzleSingle.position.x);
        const position = this.node.getParent().position.subtract(normalize);

        this.setAmmo(position);
    }

    shooting() {
        this.muzzleSingle.active = true;

        setTimeout(() => {
            this.muzzleSingle.active = false;
            if (this.towerType == TowerType.RocketTower) {
                this._avatar.spriteFrame = this.avatarSprites[this._levelTurrent];
            }
        }, 100);
    }
}


