import { _decorator, Collider2D, Component, Contact2DType, EventTouch, instantiate, IPhysics2DContact, Node, Prefab, Sprite, SpriteFrame, Vec3 } from "cc";
import { Ammo } from "./Ammo";
import { Enemy } from "./Enemy";
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {
    @property(Node)
    private action: Node;
    @property(Node)
    private actionUpgrade: Node;
    @property(Node)
    private actionSell: Node;
    @property(SpriteFrame)
    private sprite: SpriteFrame;
    @property(SpriteFrame)
    private spritePlace: SpriteFrame;
    @property(Prefab)
    private ammoPrefab: Prefab;
    
    @property
    private speed: number = 1;
    
    private _levelManager: Node;
    private _reloadTime: number = 0.8;
    private _damage: number = 2;
    private _target: Node;
    private _avatar: Sprite;
    private _isActive: boolean = false;
    private _countdown: number = 0;
    private _listEnemy: Node[] = [];

    public set levelManager(value: Node) {
        this._levelManager = value;
    }

    protected start(): void {
        this._avatar = this.getComponent(Sprite);
        this.onHideAction();

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.actionUpgrade.on(Node.EventType.TOUCH_START, this.onUpgrade, this);
        this.actionSell.on(Node.EventType.TOUCH_START, this.onSell, this);

        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    update(dt: number): void {
        this._countdown += dt;

        if (this._countdown > this._reloadTime && this._listEnemy.length > 0 && this._isActive) {
            this._countdown = 0;
            this.attackEnemy();
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node;

        if (enemy.name == 'Enemy') {
            this._listEnemy.push(enemy)
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const enemy = otherCollider.node;

        if (enemy.name == 'Enemy') {
            this._listEnemy = this._listEnemy.filter(e => e != enemy);
            this._target = null;
        }
    }

    attackEnemy() {
        if (!this._target) {
            this._target = this._listEnemy[0];
        }

        const ammo = instantiate(this.ammoPrefab);

        ammo.position = this.node.position;
        ammo.parent = this._levelManager;
        
        const target = new Vec3(this._target.position.x, this._target.position.y);
        ammo.getComponent(Ammo).init(target, this.speed, this._damage);
    }

    onTouchStart(event: EventTouch) {
        this.action.setParent(this.node);
    }

    onUpgrade() {
        this._avatar.spriteFrame = this.sprite;
        this._isActive = true;
        this.onHideAction();
    }

    onSell() {
        this._avatar.spriteFrame = this.spritePlace;
        this._isActive = false;
        this.onHideAction();
    }

    onHideAction() {
        this.action.setParent(null);
    }
}


