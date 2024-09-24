import { _decorator , instantiate, Vec3 } from "cc";
import { TurrentType } from "./Enums";
import { Turent } from "./Turent";
import { Ammo } from "./Ammo";
const { ccclass } = _decorator;

@ccclass('TurrentTank')
export class TurrentTank extends Turent {

    setAngleShoot() {
        this._diffTowerToTarget = new Vec3();
        Vec3.subtract(this._diffTowerToTarget, this.node.parent.position, this._target.parent.position);

        this._angleShoot = -90 - Math.atan2(this._diffTowerToTarget.x, this._diffTowerToTarget.y) * (180 / Math.PI);
    }

    attackTarget() {
        if (!this._target) {
            this._target = this._listTarget[0].parent;
        }

        this.shooting();

        var normalize = this._diffTowerToTarget.normalize();
        normalize.multiplyScalar(this.muzzleSingle.position.x);

        const parentPos = this.node.parent.position;
        const position = new Vec3(parentPos.x, parentPos.y).subtract(normalize);

        this.setAmmo(position);
    }

    shooting() {
        this.muzzleSingle.active = true;

        setTimeout(() => {
            this.muzzleSingle.active = false;
            if (this.towerType == TurrentType.RocketTower) {
                this._avatar.spriteFrame = this.avatarSprites[this._levelTurrent];
            }
        }, 100);
    }

    setAmmo(position: Vec3, offset: number = 0) {
        const target = new Vec3(this._target.parent.position.x + offset, this._target.parent.position.y + offset);
        const ammo = instantiate(this.ammoPrefab);

        ammo.position = new Vec3(position.x + offset, position.y + offset);
        ammo.parent = this._levelManager;

        ammo.getComponent(Ammo)
            .init(target, this.speed, this.damage, this._angleShoot, this._levelTurrent);
    }
}


