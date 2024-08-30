import { _decorator, Collider2D, Component, Contact2DType, EventTouch, instantiate, IPhysics2DContact, Node, Prefab, Sprite, SpriteFrame, Vec3 } from "cc";
import { LevelManager } from "./LevelManager";
import { Ammo } from "./Ammo";
import { Enemy } from "./Enemy";
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {
    @property(Node)
    private ammoLayer: Node;
    @property(Node)
    private action: Node;
    @property(Node)
    private actionUpgrade: Node;
    @property(Node)
    private actionSell: Node;
    @property(SpriteFrame)
    private sprite: SpriteFrame;
    @property(Prefab)
    private ammoPrefab: Prefab;
    @property(LevelManager)
    private levelManager: LevelManager;

    @property
    private speed: number = 1;
    @property
    private range: number = 600;

    private _reloadTime: number = 0.8;
    private _damage: number = 2;
    private _target: Node;
    private _avatar: Sprite;
    private _isActive: boolean = false;
    private _countdown: number = 0;
    private _listEnemy: Node[] = [];

    protected start(): void {
        this._avatar = this.getComponent(Sprite);
        this.onInActive();

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.actionUpgrade.on(Node.EventType.TOUCH_START, this.onUpgrade, this);
        this.actionSell.on(Node.EventType.TOUCH_START, this.onSell, this);

        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node;

        if (enemy) {
            this._listEnemy.push(enemy)
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node;

        if (enemy) {
            this._listEnemy = this._listEnemy.filter(e => e != enemy);
            this._target = null;
        }
    }

    protected update(dt: number): void {
        this._countdown += dt;

        if (this._countdown > this._reloadTime && this._listEnemy.length > 0 && this._isActive) {
            this._countdown = 0;
            this.attackEnemy();
        }
    }

    attackEnemy() {
        if (!this._target) {
            this._target = this._listEnemy[0];
        }

        const ammo = instantiate(this.ammoPrefab);

        ammo.parent = this.ammoLayer;
        ammo.position = this.node.position;

        const target = new Vec3(this._target.position.x, this._target.position.y);
        ammo.getComponent(Ammo).init(target, this.speed, this._damage);
    }

    findEnemyNearest(): Node {

        return this.levelManager.enemyList
            .find(enemy => {
                return Vec3.distance(enemy.position, this.node.position) <= this.range
            })
    }

    onTouchStart(event: EventTouch) {
        this.action.setParent(this.node);
    }

    onUpgrade() {
        this._avatar.spriteFrame = this.sprite;
        this._isActive = true;
        this.onInActive();
    }

    onSell() {
        this._avatar.spriteFrame = null;
        this._isActive = false;
        this.onInActive();
    }

    onInActive() {
        this.action.setParent(null);
    }
}


