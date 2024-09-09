import { _decorator, CCInteger, Collider2D, Component, Contact2DType, Enum,  instantiate, IPhysics2DContact, Node,  Prefab, Sprite, SpriteFrame, Vec3 } from "cc";
import { Ammo } from "./Ammo";
import { TowerType } from "./Enums";
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {
    @property(Node)
    private headTower: Node;
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

    private _levelManager: Node;
    private _reloadTime: number = 0.8;
    private _target: Node;
    private _avatar: Sprite;
    private _isActive: boolean = false;
    private _countdown: number = 0;
    private _listEnemy: Node[] = [];
    private _enemyNames: string[] = ['Soldier', 'Tank', 'Plane'];
    private _angleShoot: number;
    private _levelTower: number = 0;
    private _diffTowerToTarget: Vec3;

    // public set enemyName(value: string[]) {
    //     this._enemyName = value;
    // }

    public set levelManager(value: Node) {
        this._levelManager = value;
    }

    public set levelTower(value: number) {
        this._levelTower = value;
    }

    start(): void {
        let collider = this.getComponent(Collider2D);

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        if (this.towerType == TowerType.GunTower) {
            this._enemyNames = ['Soldier', 'Tank'];
        }
    }

    update(dt: number): void {
        this._countdown += dt;

        if (this._listEnemy.length == 0) {
            return;
        }

        this._diffTowerToTarget = new Vec3();
        Vec3.subtract(this._diffTowerToTarget, this.node.position, this._listEnemy[0].position);
        this._angleShoot = 180 - Math.atan2(this._diffTowerToTarget.x, this._diffTowerToTarget.y) * (180 / Math.PI);

        this.headTower.angle = this._angleShoot;

        if (this._countdown > this._reloadTime && this._listEnemy.length > 0 && this._isActive) {
            this._countdown = 0;
            this.attackEnemy();
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node;

        if (this._enemyNames.find(name => name == enemy.name)) {
            this._listEnemy.push(enemy)
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node;
        if (this._enemyNames.find(name => name == enemy.name)) {
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
        this._levelManager = levelManager;
        this._avatar = this.headTower.getComponent(Sprite);
        this.onSetSprite();
    }

    initAmmo(position: Vec3, offset: number = 0) {
        const target = new Vec3(this._target.position.x + offset, this._target.position.y + offset);
        const ammo = instantiate(this.ammoPrefab);

        ammo.position = new Vec3(position.x + offset, position.y + offset);
        ammo.parent = this._levelManager;
        ammo.getComponent(Ammo).init(target, this._target.name, this.speed, this.damage, this._angleShoot, this._levelTower);
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


