import { _decorator, CCInteger, Collider2D, Component, Contact2DType, Enum, EventTouch, instantiate, IPhysics2DContact, Node, PhysicsSystem2D, Prefab, Sprite, SpriteFrame, Vec3 } from "cc";
import { Ammo } from "./Ammo";
import { TowerType, TurretType } from "./Enums";
import { LevelManager } from "./LevelManager";
const { ccclass, property } = _decorator;

@ccclass('Turent')
export class Turent extends Component {
    @property(Node)
    private muzzleDouble: Node;
    @property(Node)
    private muzzleSingle: Node;
    @property([SpriteFrame])
    private avatarSprites: SpriteFrame[] = [];
    @property([SpriteFrame])
    private shootAvatarSprites: SpriteFrame[] = [];
    @property([CCInteger])
    private gunBarrelNumbers: number[] = [];
    @property(Prefab)
    private ammoPrefab: Prefab;
    @property({ type: Enum(TowerType) })
    private towerType: TowerType;
    @property
    private damage: number = 3;
    @property
    private speed: number = 1;
    @property
    private reloadTime: number = 0.8;
    @property({ type: [Enum(TurretType)] })
    private enemyNames: number[] = [TurretType.Soldier, TurretType.Tank, TurretType.Plane];
    @property(Node)
    private levelManager: Node;

    private _target: Node;
    private _avatar: Sprite;
    private _isActive: boolean = true;
    private _countdown: number = 0;
    private _listEnemy: Node[] = [];
    private _angleShoot: number;
    private _levelTower: number = 0;
    private _diffTowerToTarget: Vec3;

    // public set levelManager(value: Node) {
    //     this.levelManager = value;
    // }

    // public set levelTower(value: number) {
    //     this._levelTower = value;
    // }

    start(): void {
        let collider = this.getComponent(Collider2D);

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        if (this.towerType == TowerType.GunTower) {
            this.enemyNames = [TurretType.Soldier, TurretType.Tank];
        }
        console.log('start');
    }

    update(dt: number): void {
        this._countdown += dt;

        if (this._listEnemy.length == 0) {
            return;
        }

        this._diffTowerToTarget = new Vec3();
        Vec3.subtract(this._diffTowerToTarget, this.node.position, this._listEnemy[0].position);
        this._angleShoot = 180 - Math.atan2(this._diffTowerToTarget.x, this._diffTowerToTarget.y) * (180 / Math.PI);

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

    attackEnemy() {
        if (!this._target) {
            this._target = this._listEnemy[0];
        }

        this.shooting();

        var normalize = this._diffTowerToTarget.normalize();
        normalize.multiplyScalar(this.muzzleDouble.position.y);

        const gunBarrelNumber = this.gunBarrelNumbers[this._levelTower];
        const position = this._levelTower > 2
            ? this.node.position
            : this.node.position.subtract(normalize);

        if (gunBarrelNumber == 1) {
            this.initAmmo(position);
        } else {
            this.initAmmo(position, -20);
            this.initAmmo(position, 20);
        }
    }

    initTower(levelTower: number, levelManager: Node) {
        this._levelTower = levelTower;
        this.levelManager = levelManager;
        this._avatar = this.node.getComponent(Sprite);
        this.onSetSprite();
    }

    initAmmo(position: Vec3, offset: number = 0) {
        const target = new Vec3(this._target.position.x + offset, this._target.position.y + offset);
        const ammo = instantiate(this.ammoPrefab);

        ammo.position = new Vec3(position.x + offset, position.y + offset);
        ammo.parent = this.levelManager;
        
        // ammo.getComponent(Ammo).init(target, this.speed, this.damage, this._angleShoot, this._levelTower);
        ammo.getComponent(Ammo).init(target, this.speed, this.damage, this._angleShoot, 2);
    }

    shooting() {
        this.muzzleDouble.active = this.towerType == TowerType.GunTower && this._levelTower != 2;
        this.muzzleSingle.active = this.towerType == TowerType.GunTower && this._levelTower == 2;

        if (this.towerType == TowerType.RocketTower) {
            this._avatar.spriteFrame = this.shootAvatarSprites[this._levelTower];
        }

        setTimeout(() => {
            this.muzzleDouble.active = false;
            this.muzzleSingle.active = false;
            if (this.towerType == TowerType.RocketTower) {
                this._avatar.spriteFrame = this.avatarSprites[this._levelTower];
            }
        }, 100);
    }

    onSetSprite() {
        this._avatar.spriteFrame = this.avatarSprites[this._levelTower];
        this._isActive = this._levelTower > 0;
    }
}


