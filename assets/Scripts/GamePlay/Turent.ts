import { _decorator, CCInteger, Collider2D, Component, Contact2DType, Enum, instantiate, IPhysics2DContact, Node, Prefab, Sprite, SpriteFrame, Vec3 } from "cc";
import { Ammo } from "./Ammo";
import { CharacterType, GameState } from "../Enums";
import Store from "../Store";
const { ccclass, property } = _decorator;

@ccclass('Turent')
export class Turent extends Component {
    @property(Node)
    protected muzzleDouble: Node;
    @property(Node)
    protected muzzleSingle: Node;
    @property([SpriteFrame])
    protected avatarSprites: SpriteFrame[] = [];
    @property([SpriteFrame])
    protected shootAvatarSprites: SpriteFrame[] = [];
    @property([CCInteger])
    protected gunBarrelNumbers: number[] = [];
    @property(Prefab)
    protected ammoPrefab: Prefab;
    @property({ type: Enum(CharacterType) })
    protected towerType: CharacterType;
    @property({ type: [Enum(CharacterType)] })
    protected targetNames: number[] = [CharacterType.Soldier, CharacterType.Tank, CharacterType.Plane];
    @property
    protected damage: number = 3;
    @property
    protected speed: number = 1;
    @property
    protected reloadTime: number = 0.8;

    protected _levelManager: Node;
    protected _target: Node;
    protected _avatar: Sprite;
    protected _isActive: boolean = true;
    protected _countdown: number = 0;
    protected _listTarget: Node[] = [];
    protected _angleShoot: number;
    protected _levelTurrent: number = 1;
    protected _diffTowerToTarget: Vec3;
    protected _store: Store;
    protected _count = 0;

    start(): void {
        this._store = Store.getInstance();
        this._levelManager = this._store.levelManager;

        let collider = this.getComponent(Collider2D);

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        this._countdown = this.reloadTime;
    }

    update(dt: number): void {
        this._countdown += dt;

        if (this._listTarget.length == 0) {
            return;
        }
        if (!this._target) {
            this._target = this._listTarget[0];
        }
        this._count++;

        this.setAngleShoot();
        this.node.angle = this._angleShoot;

        const isCanShoot = this._countdown > this.reloadTime && this._listTarget.length > 0 && this._isActive && this._store.gameState == GameState.PlayGame;
        if (isCanShoot) {
            this._countdown = 0;
            this.attackTarget();
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const target = otherCollider.node;
        const isTower = this.targetNames.find(name => CharacterType[name] == target.name);

        if (isTower) {
            this._listTarget.push(target)
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const target = otherCollider.node;
        if (this.targetNames.find(name => CharacterType[name] == target.name)) {
            this._listTarget = this._listTarget.filter(e => e != target);
            this._target = null;
        }
    }

    setAngleShoot() {
        this._diffTowerToTarget = new Vec3();
        Vec3.subtract(this._diffTowerToTarget, this.node.parent.position, this._target.position);

        this._angleShoot = 180 - Math.atan2(this._diffTowerToTarget.x, this._diffTowerToTarget.y) * (180 / Math.PI);
    }

    attackTarget() {
        this.shooting();

        var normalize = this._diffTowerToTarget.normalize();
        normalize.multiplyScalar(this.muzzleDouble.position.y);
        const gunBarrelNumber = this.gunBarrelNumbers[this._levelTurrent];

        const parentPos = this.node.parent.position;
        const position = new Vec3(parentPos.x, parentPos.y).subtract(normalize);

        if (gunBarrelNumber == 1) {
            this.setAmmo(position);
        } else {
            this.setAmmo(position, -10);
            this.setAmmo(position, 10);
        }
    }

    initTurrent(levelTurrent: number) {
        this._levelTurrent = levelTurrent;
        this._avatar = this.node.getComponent(Sprite);
        this.onSetSprite();
    }

    setAmmo(position: Vec3, offset: number = 0) {
        const target = new Vec3(this._target.position.x + offset, this._target.position.y + offset);
        const ammo = instantiate(this.ammoPrefab);

        ammo.position = new Vec3(position.x + offset, position.y + offset);
        ammo.parent = this._store.ammoLayer;

        const damage = this.damage * this._levelTurrent;

        if (this.towerType == CharacterType.RocketTower) {
            ammo.getComponent(Ammo).initWithRocket(this._target, this.speed, damage, this._angleShoot, this._levelTurrent);
            return;
        }

        ammo.getComponent(Ammo).init(target, this.speed, damage, this._angleShoot, this._levelTurrent);
    }

    shooting() {
        this.muzzleSingle.active = this._levelTurrent == 1 && this.towerType == CharacterType.GunTower;
        this.muzzleDouble.active = this._levelTurrent != 1 && this.towerType == CharacterType.GunTower;

        if (this.towerType == CharacterType.RocketTower) {
            this._avatar.spriteFrame = this.shootAvatarSprites[this._levelTurrent];
        }

        setTimeout(() => {
            if (!this.node) {
                return
            }
            this.muzzleDouble.active = false;
            this.muzzleSingle.active = false;
            if (this.towerType == CharacterType.RocketTower) {
                this._avatar.spriteFrame = this.avatarSprites[this._levelTurrent];
            }
        }, 100);
    }

    onSetSprite() {
        this._avatar.spriteFrame = this.avatarSprites[this._levelTurrent];
        this._isActive = this._levelTurrent > 0;
    }

    onSetLevelTurrent(levelTurrent: number) {
        this._levelTurrent = levelTurrent;
        this.onSetSprite();
    }
}


