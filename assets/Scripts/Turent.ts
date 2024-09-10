import { _decorator, CCInteger, Collider2D, Component, Contact2DType, Enum, instantiate, IPhysics2DContact, Node, Prefab, Sprite, SpriteFrame, Vec3 } from "cc";
import { Ammo } from "./Ammo";
import { TowerType, TurretType } from "./Enums";
import Store from "./Store";
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
    @property({ type: Enum(TowerType) })
    protected towerType: TowerType;
    @property
    protected damage: number = 3;
    @property
    protected speed: number = 1;
    @property
    protected reloadTime: number = 0.8;
    @property({ type: [Enum(TurretType)] })
    protected enemyNames: number[] = [TurretType.Soldier, TurretType.Tank, TurretType.Plane];

    protected _levelManager: Node;
    protected _target: Node;
    protected _avatar: Sprite;
    protected _isActive: boolean = true;
    protected _countdown: number = 0;
    protected _listEnemy: Node[] = [];
    protected _angleShoot: number;
    protected _levelTurrent: number = 1;
    protected _diffTowerToTarget: Vec3;
    protected _store: Store;
    protected _count = 0;

    start(): void {
        this._store = Store.getInstance();
        this._levelManager = this._store.getLevelManage();

        let collider = this.getComponent(Collider2D);

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    update(dt: number): void {
        this._countdown += dt;

        if (this._listEnemy.length == 0) {
            return;
        }

        this._count++;
        
        this.setAngleShoot();
        this.node.angle = this._angleShoot;

        if (this._countdown > this.reloadTime && this._listEnemy.length > 0 && this._isActive) {
            this._countdown = 0;
            this.attackEnemy();
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node;

        if (this.enemyNames.find(name => TurretType[name] == enemy.name)) {
            this._listEnemy.push(enemy)
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node;
        if (this.enemyNames.find(name => TurretType[name] == enemy.name)) {
            this._listEnemy = this._listEnemy.filter(e => e != enemy);
            this._target = null;
        }
    }

    setAngleShoot() {
        this._diffTowerToTarget = new Vec3();
        Vec3.subtract(this._diffTowerToTarget, this.node.position, this._listEnemy[0].position);
        // Vec3.subtract(this._diffTowerToTarget, this.node.getParent().position, this._listEnemy[0].position);

        this._angleShoot = 180 - Math.atan2(this._diffTowerToTarget.x, this._diffTowerToTarget.y) * (180 / Math.PI);
    }

    attackEnemy() {
        if (!this._target) {
            this._target = this._listEnemy[0];
        }

        this.shooting();

        var normalize = this._diffTowerToTarget.normalize();
        normalize.multiplyScalar(this.muzzleDouble.position.y);
        const gunBarrelNumber = this.gunBarrelNumbers[this._levelTurrent];

        const position = this.node.position.subtract(normalize);
        // const position = this.node.getParent().position.subtract(normalize);

        if (gunBarrelNumber == 1) {
            this.setAmmo(position);
        } else {
            this.setAmmo(position, -20);
            this.setAmmo(position, 20);
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
        ammo.parent = this._levelManager;

        ammo.getComponent(Ammo)
            .init(target, this._target.name, this.speed, this.damage, this._angleShoot, this._levelTurrent);
    }

    shooting() {
        this.muzzleDouble.active = this.towerType == TowerType.GunTower && this._levelTurrent != 2;
        this.muzzleSingle.active = this.towerType == TowerType.GunTower && this._levelTurrent == 2;

        if (this.towerType == TowerType.RocketTower) {
            this._avatar.spriteFrame = this.shootAvatarSprites[this._levelTurrent];
        }

        setTimeout(() => {
            this.muzzleDouble.active = false;
            this.muzzleSingle.active = false;
            if (this.towerType == TowerType.RocketTower) {
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

    setHP(damage: number) {
        console.log("HP");
    }

    // setHP(damage: number) {
    //     this._currentHealth -= damage;

    //     this.healthBar.active = true;
    //     this.healthBar.getComponentInChildren(Sprite).fillRange = this._currentHealth / this._health;

    //     if (this._currentHealth <= 0) {
    //         tween(this.node).removeSelf().start();
    //     }
    // }

}


