import { _decorator, Collider2D, Component, Contact2DType, EventTouch, instantiate, IPhysics2DContact, Node, PhysicsSystem2D, Prefab, Sprite, SpriteFrame, Vec3 } from "cc";
import { Ammo } from "./Ammo";
import { Enemy } from "./Enemy";
import { LevelManager } from "./LevelManager";
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {
    @property(Node)
    private action: Node;
    @property(Node)
    private actionUpgrade: Node;
    @property(Node)
    private actionSell: Node;
    @property(Node)
    private headTower: Node;
    @property(Node)
    private muzzle: Node;
    @property(SpriteFrame)
    private avatarSprite: SpriteFrame;
    @property(SpriteFrame)
    private background: SpriteFrame;
    @property(SpriteFrame)
    private backgroundDefault: SpriteFrame;
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
    private _diffTowerToTarget: Vec3;

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

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.actionUpgrade.on(Node.EventType.TOUCH_START, this.onUpgrade, this);
        this.actionSell.on(Node.EventType.TOUCH_START, this.onSell, this);

        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        // if (PhysicsSystem2D.instance) {
        //     PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        //     PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        // }
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
        this.muzzle.active = true;
        const ammo = instantiate(this.ammoPrefab);

        setTimeout(() => {
            this.muzzle.active = false;
        }, 100);

        var normalize = this._diffTowerToTarget.normalize();
        normalize.multiplyScalar(this.muzzle.position.y);
        ammo.position = this.node.position.subtract(normalize);

        ammo.parent = this._levelManager;

        const target = new Vec3(this._target.position.x, this._target.position.y);
        ammo.getComponent(Ammo).init(target, this.speed, this.damage, this._angleShoot);
    }

    onTouchStart(event: EventTouch) {
        this._levelManager.getComponent(LevelManager).onHideActionTower(this);
        this.action.setParent(this.node);
    }

    onUpgrade() {
        this._background.spriteFrame = this.background;
        this._isActive = true;
        this._avatar.spriteFrame = this.avatarSprite;
        this.onHideAction();
    }

    onSell() {
        this._background.spriteFrame = this.backgroundDefault;
        this._avatar.spriteFrame = null;
        this._isActive = false;
        this.onHideAction();
    }

    onHideAction() {
        this.action.setParent(null);
    }
}


