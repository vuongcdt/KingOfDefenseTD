import { _decorator, Collider2D, Component, Contact2DType, EventTouch, instantiate, IPhysics2DContact, Node, PhysicsSystem2D, Prefab, Sprite, SpriteFrame, Vec3 } from "cc";
import { Ammo } from "./Ammo";
import { Enemy } from "./Enemy";
import { LevelManager } from "./LevelManager";
import { GunType } from "./Enums";
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {
    @property(Node)
    private action: Node;
    @property(Node)
    private actionBuyRocket: Node;
    @property(Node)
    private actionUpgrade: Node;
    @property(Node)
    private actionSell: Node;
    @property(Node)
    private actionBuyGun: Node;
    @property(Node)
    private headTower: Node;
    @property(Node)
    private muzzleDouble: Node;
    @property(Node)
    private muzzleSingle: Node;
    @property([SpriteFrame])
    private avatarGunSprites: SpriteFrame[] = [];
    @property([SpriteFrame])
    private avatarRocketSprites: SpriteFrame[] = [];
    @property([SpriteFrame])
    private shootAvatarSprites: SpriteFrame[] = [];
    @property([SpriteFrame])
    private backgrounds: SpriteFrame[] = [];
    @property([Number])
    private gunBarrelNumbers: number[] = [];
    @property([Number])
    private rocketNumbers: number[] = [];
    @property(Prefab)
    private ammoPrefab: Prefab;
    @property
    private damage: number = 3;
    @property
    private speed: number = 1;

    private _levelManager: Node;
    private _reloadTime: number = 0.8;
    private _target: Node;
    private _background: Sprite;
    private _avatar: Sprite;
    private _isActive: boolean = false;
    private _countdown: number = 0;
    private _listEnemy: Node[] = [];
    private _enemyName: string;
    private _angleShoot: number;
    private _levelTower: number = 0;
    private _diffTowerToTarget: Vec3;
    private _gunType: GunType;

    public set enemyName(value: string) {
        this._enemyName = value;
    }

    public set levelManager(value: Node) {
        this._levelManager = value;
    }

    protected start(): void {
        this._avatar = this.headTower.getComponent(Sprite);
        this._background = this.getComponent(Sprite);
        this.onHideAction();

        this.node.on(Node.EventType.TOUCH_START, this.onShowAction, this);
        this.actionBuyRocket.on(Node.EventType.TOUCH_START, this.onBuyRocket, this);
        this.actionBuyGun.on(Node.EventType.TOUCH_START, this.onBuyGun, this);
        this.actionSell.on(Node.EventType.TOUCH_START, this.onSell, this);
        this.actionUpgrade.on(Node.EventType.TOUCH_START, this.onUpgrade, this);

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
        if (enemy.name == this._enemyName) {
            this._listEnemy.push(enemy)
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node;
        if (enemy.name == this._enemyName) {
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

        const gunBarrelNumber = this._gunType == GunType.Gun
            ? this.gunBarrelNumbers[this._levelTower]
            : this.rocketNumbers[this._levelTower];
        const position = this._levelTower > 2
            ? this.node.position
            : this.node.position.subtract(normalize);

        if (gunBarrelNumber == 1) {
            this.initAmmo(normalize, position);
        } else {
            this.initAmmo(normalize, position, -20);
            this.initAmmo(normalize, position, 20);
        }
    }

    initAmmo(normalize: Vec3, position: Vec3, offsetX: number = 0) {
        const ammo = instantiate(this.ammoPrefab);
        ammo.position = new Vec3(position.x + offsetX, position.y);

        ammo.parent = this._levelManager;

        const target = new Vec3(this._target.position.x + offsetX, this._target.position.y);

        // ammo.getComponent(Ammo).init(target, this.speed, this.damage, this._angleShoot, this._gunType);
        ammo.getComponent(Ammo).init(target, this.speed, this.damage, this._angleShoot, this._levelTower);
    }

    shooting() {
        // this.muzzle.active = this._levelTower < 3;
        this.muzzleDouble.active = this._gunType == GunType.Gun && this._levelTower != 2;
        this.muzzleSingle.active = this._gunType == GunType.Gun && this._levelTower == 2;
        if (this._gunType == GunType.Rocket) {
            this._avatar.spriteFrame = this.shootAvatarSprites[this._levelTower];
        }

        setTimeout(() => {
            this.muzzleDouble.active = false;
            this.muzzleSingle.active = false;
            if (this._gunType == GunType.Rocket) {
                this._avatar.spriteFrame = this.avatarRocketSprites[this._levelTower];
            }
        }, 100);
    }

    onShowAction(event: EventTouch) {
        this._levelManager.getComponent(LevelManager).onHideActionTower(this);
        this.action.setParent(this.node);
        this.actionSell.active = this._levelTower != 0;
        this.actionUpgrade.active = this._levelTower != 0 && this._levelTower != this.backgrounds.length - 1;;
        this.actionBuyGun.active = this._levelTower == 0;
        this.actionBuyRocket.active = this._levelTower == 0;
    }

    onUpgrade() {
        this._levelTower++;
        this.onSetSprite();
    }

    onBuyGun() {
        this._gunType = GunType.Gun;
        this._levelTower++;
        this.onSetSprite();
    }

    onBuyRocket() {
        this._gunType = GunType.Rocket;
        this._levelTower++;
        this.onSetSprite();
    }

    onSell() {
        this._gunType = GunType.None;
        this._levelTower = 0;
        this.onSetSprite();
    }

    onSetSprite() {
        this._background.spriteFrame = this.backgrounds[this._levelTower];
        this._avatar.spriteFrame = this._gunType == GunType.Rocket
            ? this.avatarRocketSprites[this._levelTower]
            : this.avatarGunSprites[this._levelTower];
        this._isActive = this._levelTower > 0;
        this.onHideAction();
    }

    onHideAction() {
        this.action.setParent(null);
    }
}


